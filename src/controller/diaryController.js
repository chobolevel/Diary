import Diary from "../models/Diary";
import User from "../models/User";

//홈화면에서 다이어리 모두 보기
export const home = async (req, res) => {
  const diaries = await Diary.find({})
    .sort({ createdAt: "desc" })
    .limit(10)
    .populate("author");
  return res.render("diaries/home", {
    pageTitle: "홈",
    diaries,
  });
};
//다이어리 읽기
export const see = async (req, res) => {
  const { id } = req.params;
  const diary = await Diary.findById(id).populate("author");
  return res.render("diaries/diary", {
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
  return res.render("diaries/edit-diary", {
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
  const { user } = req.session;
  const diaryOwner = await User.findByIdAndUpdate(user._id, {
    $pull: {
      diaries: id,
    },
  });
  await Diary.findByIdAndRemove(id);
  return res.redirect("/");
};
//다이어리 작성하기
export const getWrite = (req, res) => {
  return res.render("diaries/write", {
    pageTitle: "하루 기록",
  });
};
export const postWrite = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { title, memo } = req.body;
  const { file } = req;
  try {
    const newDiary = await Diary.create({
      title,
      memo,
      author: _id,
      imageFile: file ? file.path.replace(/[\\]/g, "/") : null,
    });
    const user = await User.findById(_id);
    user.diaries.push(newDiary._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error._message);
    return res.status(400).render("diaries/home", {
      pageTitle: "홈",
      errorMessage: error._message,
    });
  }
};
//다이어리 검색
export const getSearch = (req, res) => {
  return res.render("diaries/search", {
    pageTitle: "검색",
  });
};
export const postSearch = async (req, res) => {
  const { title } = req.body;
  const searchDiary = await Diary.findOne({
    title: { $regex: new RegExp(title, "i") },
  }).populate("author");
  if (!searchDiary) {
    return res.status(404).render("diaries/search", {
      pageTitle: "검색",
      errorMessage: "검색 결과가 존재하지 않습니다.",
    });
  }
  return res.status(200).render("diaries/search", {
    pageTitle: "검색 결과",
    searchDiary,
  });
  return res.end();
};
export const registerView = async (req, res) => {
  const { id } = req.params;
  const diary = await Diary.findById(id);
  if (!diary) {
    return res.sendStatus(404);
  }
  diary.views += 1;
  await diary.save();
  return res.sendStatus(200);
};
