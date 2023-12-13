window.onload = () => {
    const catButton = document.getElementById("cat");
    const dogButton = document.getElementById("dog");

    async function sendData(value) {
        const postData = { value };

        fetch("http://0.0.0.0:3000/app", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });
    }

    catButton.addEventListener("click", () => {
        sendData("cat");
    });

    dogButton.addEventListener("click", () => {
        sendData("dog");
    });
};
