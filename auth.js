import { supabase } from "./supabaseClient";

export async function signUpUser({ email, password, full_name, role, admin_key }) {
  if (role === "admin") {
    const adminAccessCode = process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE;
    if (admin_key !== adminAccessCode) {
      throw new Error("Invalid admin access code");
    }
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, role },
    },
  });

  if (signUpError) throw signUpError;

  const user = signUpData.user;

  if (role === "admin") {
    const { error } = await supabase.from("admins").insert([
      { id: user.id, full_name, email },
    ]);
    if (error) throw error;
  } else if (role === "customer") {
    const { error } = await supabase.from("customers").insert([
      { id: user.id, full_name, email },
    ]);
    if (error) throw error;
  }

  return user;
}

export async function signInUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
