import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "eu-central-1_ppZRWs3cG",
  ClientId: "3730ac60rm25n3141afc9447l2",
};

const UserPool = new CognitoUserPool(poolData);

export default UserPool;
