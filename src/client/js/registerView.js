const diaryContainer = document.getElementById("diary_container");

const handleLoad = async () => {
  const { id } = diaryContainer.dataset;
  const apiUrl = `/api/${id}/views`;
  await fetch(apiUrl, {
    method: "POST",
  });
};

window.addEventListener("load", handleLoad);
