import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getLogin = (req, res) => {
  return res.render("users/login", {
    pageTitle: "로그인",
  });
};
export const postLogin = async (req, res) => {
  const { id, password } = req.body;
  const user = await User.findOne({ id });
  if (!user) {
    return res.status(400).render("users/login", {
      pageTitle: "로그인",
      errorMessage: "아이디가 존재하지 않습니다.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("users/login", {
      pageTitle: "로그인",
      errorMessage: "비밀번호가 올바르지 않습니다.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/1");
};
//유저 회원가입 컨트롤러
export const getJoin = (req, res) => {
  return res.render("users/join", {
    pageTitle: "회원가입",
  });
};
export const postJoin = async (req, res) => {
  //아이디, 이메일 중복되서 사용되지 않도록 만들기
  const { email, password, passcheck, name, nickname, location } = req.body;
  const sameEmailUser = await User.findOne({ email });
  if (sameEmailUser) {
    return res.status(400).render("users/join", {
      pageTitle: "회원가입",
      errorMessage: "이미 이메일이 존재합니다.",
    });
  }
  if (password !== passcheck) {
    return res.status(400).render("users/join", {
      pageTitle: "회원가입",
      errorMessage: "비밀번호와 확인 비밀번호가 일치하지 않습니다.",
    });
  }
  try {
    await User.create({
      email,
      password,
      name,
      nickname,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("users/join", {
      pageTitle: "회원가입",
      errorMessage: "회원생성을 실패하였습니다. 다시 시도해 주시기 바랍니다.",
    });
  }
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/1");
};
//깃헙으로 로그인하기
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENTID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENTID,
    client_secret: process.env.GH_CLIENT_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
      //이메일이 존재하지 않은 경우 Login화면으로 보냄
    }
    let user = await User.findOne({ email: emailObj.email });
    //만약 github Email로 존재하는 계정이 없는 경우 처리하기
    if (!user) {
      user = await User.create({
        email: emailObj.email,
        password: "",
        name: userData.name,
        nickname: userData.login,
        location: userData.location,
        avatarUrl: userData.avatar_url,
        socialOnly: true,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/1");
    }
    //Github Email로 생성된 계정이 있는 경우
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/1");
  }
  //토큰이 없는 경우
  return res.redirect("/login");
};
export const see = async (req, res) => {
  //유저정보는 파라미터로만 주고받아야함
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "diaries",
    populate: {
      path: "author",
    },
  });
  return res.render("users/profile", {
    pageTitle: user.nickname,
    user,
  });
};
export const getEdit = (req, res) => {
  const { user } = req.session;
  return res.render("users/edit-profile", {
    pageTitle: user.nickname,
  });
};
export const postEdit = async (req, res) => {
  const { name, nickname, location } = req.body;
  const { id } = req.params;
  const { file } = req;
  const updateUser = await User.findByIdAndUpdate(
    id,
    {
      name,
      nickname,
      location,
      avatarUrl: file.path.replace(/[\\]/g, "/"),
    },
    {
      new: true,
    }
  );
  req.session.user = updateUser;
  return res.redirect(`/users/${id}`);
};
export const getChangePassword = (req, res) => {
  const { _id, nickname, socialOnly } = req.session.user;
  if (socialOnly) {
    return res.status(400).redirect(`/users/${_id}`);
  }
  return res.render("users/c-pass-profile", {
    pageTitle: nickname,
  });
};
export const postChangePassword = async (req, res) => {
  const { current_pass, password, passcheck } = req.body;
  const { id } = req.params;
  const user = await User.findById(id);
  if (user.socialOnly) {
    return res.redirect("");
  }
  const ok = await bcrypt.compare(current_pass, user.password);
  //현재 비밀번호 틀릴 경우
  if (!ok) {
    return res.status(400).render("users/c-pass-profile", {
      pageTitle: user.nickname,
      errorMessage: "현재 비밀번호가 올바르지 않습니다.",
    });
  }
  if (password !== passcheck) {
    return res.status(400).render("users/c-pass-profile", {
      pageTitle: user.nickname,
      errorMessage: "변경할 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
    });
  }
  user.password = password;
  user.save();
  return res.redirect("/");
};
export const delUser = async (req, res) => {
  const { id } = req.params;
  const ok = await User.findByIdAndDelete(id);
  if (!ok) {
    return res.status(400).redirect(`/users/${id}`);
  }
  req.session.destroy();
  return res.status(200).redirect("/1");
};
