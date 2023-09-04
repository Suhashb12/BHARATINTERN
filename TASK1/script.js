document.addEventListener("DOMContentLoaded", function() {
    const contentForm = document.getElementById("contentForm");
    const contentList = document.getElementById("contentList");

    contentForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const body = document.getElementById("body").value;

        const contentItem = document.createElement("li");
        contentItem.innerHTML = `<h3>${title}</h3><p>${body}</p>`;
        contentList.appendChild(contentItem);

        contentForm.reset();
    });
});