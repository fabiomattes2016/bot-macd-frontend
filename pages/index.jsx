import supabase from "../utils/supabase";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { paginate } from "../utils/paginate";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";

export async function getStaticProps() {
  const { data: list_compras, error_list_compras } = await supabase
    .from("compras")
    .select("*")
    .order("timestamp", { ascending: false });

  const { data: list_vendas, error_list_vendas } = await supabase
    .from("vendas")
    .select("*")
    .order("timestamp", { ascending: false });

  const { data: current_balance, error: error_current_balance } = await supabase
    .from("current_balance")
    .select("*")
    .eq("id", "15c35a5a-1169-4eee-bb2f-5097e0f13bfd")
    .single();

  const { data: current_price, error_current_price } = await supabase
    .from("current_price")
    .select("*")
    .eq("id", "24b8b5f0-8e76-4cbe-9f1e-6841fd03fa3a")
    .single();

  if (error_current_balance) {
    throw new Error(error_current_balance.message);
  }

  if (error_current_price) {
    throw new Error(error_current_price.message);
  }

  return {
    props: {
      currentPrice: current_price,
      currentBalanceStatic: current_balance,
      listCompras: list_compras,
      listVendas: list_vendas,
    },
  };
}

export default function Home({ listCompras, listVendas }) {
  //console.log(supabase.auth.user());

  const [currentPrice, setCurrentPrice] = useState(0.0);
  const [currentBalance, setCurrentBalance] = useState({
    new: { btc: 0, usdt: 0, timestamp: "" },
  });
  const [compras, setCompras] = useState(listCompras);
  const [vendas, setVendas] = useState(listVendas);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const getCompras = async () => {
      const { data: list_compras, error_list_compras } = await supabase
        .from("compras")
        .select("*")
        .order("timestamp", { ascending: false });

      setCompras(list_compras);
    };

    const getVendas = async () => {
      const { data: list_vendas, error_list_vendas } = await supabase
        .from("vendas")
        .select("*")
        .order("timestamp", { ascending: false });

      setVendas(list_vendas);
    };

    const priceSubscription = supabase
      .from("current_price")
      .on("UPDATE", (payload) => {
        setCurrentPrice(payload.new.price);
      })
      .subscribe();

    const balanceSubscription = supabase
      .from("current_balance")
      .on("UPDATE", (payload) => {
        setCurrentBalance(payload);
      })
      .subscribe();

    const comprasSubscription = supabase
      .from("compras")
      .on("*", (payload) => {
        getCompras();
      })
      .subscribe();

    const vendasSubscription = supabase
      .from("vendas")
      .on("*", (payload) => {
        getVendas();
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(priceSubscription);
      supabase.removeSubscription(balanceSubscription);
      supabase.removeSubscription(comprasSubscription);
      supabase.removeSubscription(vendasSubscription);
    };
  }, [currentPrice, currentBalance]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginateCompras = paginate(compras, currentPage, pageSize);
  const paginateVendas = paginate(vendas, currentPage, pageSize);

  return (
    <>
      <Header />

      <hr />

      <p>Data/Hora: {currentBalance.new.timestamp}</p>
      <p>Saldo BTC: {currentBalance.new.btc}</p>
      <p>Saldo USDT: {currentBalance.new.usdt}</p>

      <hr />

      <p>Preço Atual: {currentPrice}</p>

      <hr />

      <p>Compras</p>
      <table>
        <thead>
          <tr>
            <th>Par</th>
            <th>Quantidade</th>
            <th>Preço de compra</th>
            <th>Preço alvo</th>
            <th>Stop/Loss</th>
            <th>Data/Hora</th>
          </tr>
        </thead>
        <tbody>
          {paginateCompras.map((compra) => (
            <tr key={compra.id}>
              <td>{compra.pair}</td>
              <td>{compra.quantity}</td>
              <td>{compra.buyPrice}</td>
              <td>{compra.targetPrice}</td>
              <td>{compra.stopPrice}</td>
              <td>{compra.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        items={compras.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      <hr />

      <p>Vendas</p>
      <table>
        <thead>
          <tr>
            <th>Par</th>
            <th>Quantidade</th>
            <th>Preço de venda</th>
            <th>Preço alvo</th>
            <th>Stop/Loss</th>
            <th>Data/Hora</th>
          </tr>
        </thead>
        <tbody>
          {paginateVendas.map((venda) => (
            <tr key={venda.id}>
              <td>{venda.pair}</td>
              <td>{venda.quantity}</td>
              <td>{venda.sellPrice}</td>
              <td>{venda.targetPrice}</td>
              <td>{venda.stopPrice}</td>
              <td>{venda.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        items={vendas.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </>
  );
}
