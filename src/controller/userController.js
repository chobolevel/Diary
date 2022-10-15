import User from "../models/User";
import bcrypt from "bcrypt";

export const getLogin = (req, res) => {
  return res.render("login", {
    pageTitle : "Login",
  })
}
export const postLogin = async (req, res) => {
  const { id, password } = req.body;
  const user = await User.findOne({ id });
  if(!user) {
    return res.status(400).render("login", {
      pageTitle : "Login",
      errorMessage : "아이디가 존재하지 않습니다.",
    })
  }
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) {
    return res.status(400).render("login", {
      pageTitle : "Login",
      errorMessage : "비밀번호가 올바르지 않습니다.",
    })
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
}
//유저 회원가입 컨트롤러
export const getJoin = (req, res) => {
  return res.render("join", {
    pageTitle : "Join"
  })
}
export const postJoin = async (req, res) => {
  //아이디, 이메일 중복되서 사용되지 않도록 만들기
  const { id, password, passcheck, name, email } = req.body;
  const sameIdUser = await User.findOne({ id });
  const sameEmailUser = await User.findOne({ email });
  if(sameIdUser) {
    return res.status(400).render("join", {
      pageTitle : "Join",
      errorMessage : "이미 ID가 존재합니다.",
    })
  }
  if(sameEmailUser) {
    return res.status(400).render("join", {
      pageTitle : "Join",
      errorMessage : "이미 이메일이 존재합니다.",
    })
  }
  if(password !== passcheck) {
    return res.status(400).render("join", {
      pageTitle : "Join",
      errorMessage : "비밀번호와 확인 비밀번호가 일치하지 않습니다.",
    })
  }
  try {
    await User.create({
      id,
      password,
      name,
      email,
    })
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle : "Join",
      errorMessage : error._message,
    })
  }
}
export const logout = (req ,res) => {
  req.session.destroy();
  return res.redirect("/");
}
export const see = (req, res) => {
  res.send("See tho profile");
}
export const update = (req, res) => {
  res.send("Update your profile");
}
export const del = (req, res) => {
  res.send("Delete your account");
}