exports.handler = async () => {
  console.log(process.env.TEST_VARIABLE);

  return {
    statusCode: 200,
    body: "Hello, Channing!",
  };
};
