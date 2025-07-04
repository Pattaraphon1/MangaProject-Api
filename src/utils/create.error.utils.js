export const createError =(code, msg)=>{
  // code body
  const error = new Error(msg)
  error.code = code;
  throw error;
}