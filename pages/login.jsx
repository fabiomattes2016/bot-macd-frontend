import supabase from "../utils/supabase";

export default function LoginPage() {
  async function handleSubmit(event) {
    event.preventDefault();

    const email = event.target.email.value;

    let res = await supabase.auth.signIn({ email });

    console.log(res);
  }

  return (
    <div>
      <h1>Log In</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail</label>
        <input type="email" name="email" id="email" />

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
