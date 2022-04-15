import axios from "axios";
import Cookies from "universal-cookie";

// let baseURL = "http://192.168.1.104:8001";
let baseURL = "https://mighty-garden-27477.herokuapp.com"; // production

let instance = axios.create({
  baseURL: baseURL,
  timeout: 1800000,
});

const getAuthHeader = () => {
  try {
    let cookies = new Cookies();
    const token = cookies.get("jwt", { path: "/" });

    var auth_data = "";
    if (token) {
      auth_data = token;
    } else {
      auth_data = "";
    }
    instance.defaults.headers = { authorization: auth_data };
  } catch (error) {
    console.log(error);
  }
  return;
};

getAuthHeader();

export const Connector = instance;
export const ApiUrl = baseURL;
export const AuthHeader = getAuthHeader;
