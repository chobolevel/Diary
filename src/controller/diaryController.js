import Diary from "../models/Diary";
import User from "../models/User";

export const home = async (req, res) => {
  const diaries = await Diary.find({});
  return res.render("home", {
    pageTitle: "Home",
    diaries,
  });
};
export const see = async (req, res) => {
  const { id } = req.params;
  const diary = await Diary.findById(id).populate("author");
  return res.render("diary", {
    pageTitle: diary.title,
    diary,
  });
};
//다이어라 수정하기
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const diary = await Diary.findById(id);
  if (!diary) {
    return res.status(404).render("404", {
      pageTitle: "Diary Not Found",
    });
  }
  return res.render("edit-diary", {
    pageTitle: `Edit ${diary.title}`,
    diary,
  });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, memo } = req.body;
  const diary = await Diary.exists({ _id: id });
  if (!diary) {
    return res.status(404).render("404", {
      pageTitle: "Diary Not Found",
    });
  }
  await Diary.findByIdAndUpdate(id, {
    title,
    memo,
  });
  return res.redirect("/");
};
//다이어리 삭제하기
export const del = async (req, res) => {
  const { id } = req.params;
  await Diary.findByIdAndRemove(id);
  return res.redirect("/");
};
//다이어리 작성하기
export const getWrite = (req, res) => {
  return res.render("write", {
    pageTitle: "Write Diary",
  });
};
export const postWrite = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { title, memo } = req.body;
  try {
    const newDiary = await Diary.create({
      title,
      memo,
      author: _id,
    });
    const user = await User.findById(_id);
    user.diaries.push(newDiary._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error._message);
    return res.status(400).render("home", {
      pageTitle: "Home",
      errorMessage: error._message,
    });
  }
};
