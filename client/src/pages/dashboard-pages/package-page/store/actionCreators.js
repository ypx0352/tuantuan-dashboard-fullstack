import axios from "axios";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;


export const searchPackageAction = (pk_id) => {
  return async (dispatch) => {
    try {
        const response = await axios.get(serverBaseUrl + `/api/package/?pk_id=${pk_id}`);
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
  };
};
