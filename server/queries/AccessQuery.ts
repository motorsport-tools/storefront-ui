export default `
query ($res_id: Int!, $pid: Int!, $model: String!, $access_token: String!) {
  access(resId: $res_id, pid: $pid, model: $model, accessToken: $access_token){
   access 
  } 
}`