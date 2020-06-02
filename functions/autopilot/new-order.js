exports.handler = function (context, event, callback) {
  let response = {
    actions: [
      {
        say: `Sure. We are preparing ${event.Field_Quantity_Value} ${event.Field_Beverage_Value}`,
      },
    ],
  };

  callback(null, response);
};
