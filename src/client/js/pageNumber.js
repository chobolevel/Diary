const pageNumber = document.querySelector(".pageNumber");
const count = pageNumber.dataset.count;

const handleLoad = () => {
  for (let i = 1; i <= count; i++) {
    console.log(i);
    const a = document.createElement("a");
    a.href = `/${i}`;
    a.innerText = i;
    pageNumber.appendChild(a);
  }
};

window.addEventListener("load", handleLoad);
