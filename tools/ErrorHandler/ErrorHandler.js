import { message } from "antd";
import { Modal } from "antd";
export const ResponseError = (res) => {
  if (res.response) {
    switch (res.response.data.message) {
      case "User is banned from login":
        Modal.error({
          title: "Account banned from login",
          content: <div>Your account are prevented from login</div>,
        });
        return;

      default:
        console.log(res.response.data);
        return message.error(res.response.data.message);
    }
  } else {
    return message.error("Fail to fetch data");
  }
};
