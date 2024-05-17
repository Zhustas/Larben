import Cookies from "js-cookie";

export function checkSessionToken() {
  const hr = new XMLHttpRequest();
  hr.open("GET", "https://localhost:3000/checkSessionToken");
  hr.withCredentials = true;
  hr.send();

  hr.onload = () => {
    const response = hr.response;

    console.log(response);

    if (response !== "Session token valid") {
      Cookies.remove("sessionToken");
      deleteSessionToken();

      window.location = "/";
    }
  };
}

function deleteSessionToken() {
  const hr = new XMLHttpRequest();
  hr.open("DELETE", "https://localhost:3000/sessionToken");
  hr.withCredentials = true;
  hr.send();
}

export { deleteSessionToken };
