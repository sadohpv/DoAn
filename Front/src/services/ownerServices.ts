import axios from "~/utility/Axios/NestjsAPI";

interface ResponseOwnerData {

}

function handleGetDataOwner() {
  return axios.get<ResponseOwnerData, ResponseOwnerData>(`/user/owner`,);
}
