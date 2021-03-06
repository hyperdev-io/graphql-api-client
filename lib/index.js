var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const fetch = require("node-fetch");
const { ApolloClient } = require("apollo-client");
const { HttpLink } = require("apollo-link-http");
const { setContext } = require('apollo-link-context');
const { WebSocketLink } = require("apollo-link-ws");
const { onError } = require("apollo-link-error");
const {
  InMemoryCache,
  IntrospectionFragmentMatcher
} = require("apollo-cache-inmemory");
const introspectionQueryResultData = require("./fragmentTypes.json");

// Refer to https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher
// on how to obtain the fragmentTypes data
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});
const cache = new InMemoryCache({ fragmentMatcher });

const authLink = token => setContext((_, { headers }) => {
  return {
    headers: _extends({}, headers, {
      authorization: token ? `Bearer ${token}` : ""
    })
  };
});

const errorLink = ({ onUserError, onNetworkError }) => onError(error => {
  if (error.networkError && onNetworkError) {
    onNetworkError(error.networkError);
  } else if (error.graphQLErrors && onUserError) {
    error.graphQLErrors.forEach(onUserError);
  }
});

module.exports = {
  client: (uri, opts = {}) => {
    const client = new ApolloClient({
      link: errorLink(opts).concat(authLink(opts.token).concat(new HttpLink({ uri, fetch }))),
      cache
    });
    return {
      instances: require("./instances")(client),
      apps: require("./apps")(client),
      buckets: require("./buckets")(client),
      datastores: require("./datastores")(client),
      resources: require("./resources")(client),
      appstoreapps: require("./appstoreapps")(client),
      currentUser: require("./current-user")(client),
      reset: () => client.resetStore(),
      apolloClient: client
    };
  },
  subscriptions: (uri, token, options = { reconnect: true }, webSocketImpl) => {
    options.connectionParams = { token };
    const wsLink = new WebSocketLink({ uri, options, webSocketImpl });
    const wsclient = new ApolloClient({
      link: wsLink,
      cache
    });
    return {
      instances: require("./subscriptions/instances")(wsclient),
      apps: require("./subscriptions/apps")(wsclient),
      buckets: require("./subscriptions/buckets")(wsclient),
      resources: require("./subscriptions/resources")(wsclient),
      reset: () => {
        wsclient.resetStore();
        wsLink.subscriptionClient.reconnect = false;
        wsLink.subscriptionClient.client.close();
      },
      apolloClient: wsclient
    };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJmZXRjaCIsInJlcXVpcmUiLCJBcG9sbG9DbGllbnQiLCJIdHRwTGluayIsInNldENvbnRleHQiLCJXZWJTb2NrZXRMaW5rIiwib25FcnJvciIsIkluTWVtb3J5Q2FjaGUiLCJJbnRyb3NwZWN0aW9uRnJhZ21lbnRNYXRjaGVyIiwiaW50cm9zcGVjdGlvblF1ZXJ5UmVzdWx0RGF0YSIsImZyYWdtZW50TWF0Y2hlciIsImNhY2hlIiwiYXV0aExpbmsiLCJ0b2tlbiIsIl8iLCJoZWFkZXJzIiwiYXV0aG9yaXphdGlvbiIsImVycm9yTGluayIsIm9uVXNlckVycm9yIiwib25OZXR3b3JrRXJyb3IiLCJlcnJvciIsIm5ldHdvcmtFcnJvciIsImdyYXBoUUxFcnJvcnMiLCJmb3JFYWNoIiwibW9kdWxlIiwiZXhwb3J0cyIsImNsaWVudCIsInVyaSIsIm9wdHMiLCJsaW5rIiwiY29uY2F0IiwiaW5zdGFuY2VzIiwiYXBwcyIsImJ1Y2tldHMiLCJkYXRhc3RvcmVzIiwicmVzb3VyY2VzIiwiYXBwc3RvcmVhcHBzIiwiY3VycmVudFVzZXIiLCJyZXNldCIsInJlc2V0U3RvcmUiLCJhcG9sbG9DbGllbnQiLCJzdWJzY3JpcHRpb25zIiwib3B0aW9ucyIsInJlY29ubmVjdCIsIndlYlNvY2tldEltcGwiLCJjb25uZWN0aW9uUGFyYW1zIiwid3NMaW5rIiwid3NjbGllbnQiLCJzdWJzY3JpcHRpb25DbGllbnQiLCJjbG9zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNQSxRQUFRQyxRQUFRLFlBQVIsQ0FBZDtBQUNBLE1BQU0sRUFBRUMsWUFBRixLQUFtQkQsUUFBUSxlQUFSLENBQXpCO0FBQ0EsTUFBTSxFQUFFRSxRQUFGLEtBQWVGLFFBQVEsa0JBQVIsQ0FBckI7QUFDQSxNQUFNLEVBQUVHLFVBQUYsS0FBaUJILFFBQVEscUJBQVIsQ0FBdkI7QUFDQSxNQUFNLEVBQUVJLGFBQUYsS0FBb0JKLFFBQVEsZ0JBQVIsQ0FB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RUFBcUM4QyxRQUFyQyxDQUpOO0FBS0xULGFBQU8sTUFBTTtBQUNYUyxpQkFBU1IsVUFBVDtBQUNBTyxlQUFPRSxrQkFBUCxDQUEwQkwsU0FBMUIsR0FBc0MsS0FBdEM7QUFDQUcsZUFBT0Usa0JBQVAsQ0FBMEJ0QixNQUExQixDQUFpQ3VCLEtBQWpDO0FBQ0QsT0FUSTtBQVVMVCxvQkFBY087QUFWVCxLQUFQO0FBWUQ7QUFyQ2MsQ0FBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBmZXRjaCA9IHJlcXVpcmUoXCJub2RlLWZldGNoXCIpO1xuY29uc3QgeyBBcG9sbG9DbGllbnQgfSA9IHJlcXVpcmUoXCJhcG9sbG8tY2xpZW50XCIpO1xuY29uc3QgeyBIdHRwTGluayB9ID0gcmVxdWlyZShcImFwb2xsby1saW5rLWh0dHBcIik7XG5jb25zdCB7IHNldENvbnRleHQgfSA9IHJlcXVpcmUoJ2Fwb2xsby1saW5rLWNvbnRleHQnKTtcbmNvbnN0IHsgV2ViU29ja2V0TGluayB9ID0gcmVxdWlyZShcImFwb2xsby1saW5rLXdzXCIpO1xuY29uc3QgeyBvbkVycm9yIH0gPSByZXF1aXJlKFwiYXBvbGxvLWxpbmstZXJyb3JcIik7XG5jb25zdCB7XG4gIEluTWVtb3J5Q2FjaGUsXG4gIEludHJvc3BlY3Rpb25GcmFnbWVudE1hdGNoZXJcbn0gPSByZXF1aXJlKFwiYXBvbGxvLWNhY2hlLWlubWVtb3J5XCIpO1xuY29uc3QgaW50cm9zcGVjdGlvblF1ZXJ5UmVzdWx0RGF0YSA9IHJlcXVpcmUoXCIuL2ZyYWdtZW50VHlwZXMuanNvblwiKTtcblxuLy8gUmVmZXIgdG8gaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vZG9jcy9yZWFjdC9hZHZhbmNlZC9mcmFnbWVudHMuaHRtbCNmcmFnbWVudC1tYXRjaGVyXG4vLyBvbiBob3cgdG8gb2J0YWluIHRoZSBmcmFnbWVudFR5cGVzIGRhdGFcbmNvbnN0IGZyYWdtZW50TWF0Y2hlciA9IG5ldyBJbnRyb3NwZWN0aW9uRnJhZ21lbnRNYXRjaGVyKHtcbiAgaW50cm9zcGVjdGlvblF1ZXJ5UmVzdWx0RGF0YVxufSk7XG5jb25zdCBjYWNoZSA9IG5ldyBJbk1lbW9yeUNhY2hlKHsgZnJhZ21lbnRNYXRjaGVyIH0pO1xuXG5jb25zdCBhdXRoTGluayA9IHRva2VuID0+IHNldENvbnRleHQoKF8sIHsgaGVhZGVycyB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgaGVhZGVyczoge1xuICAgICAgLi4uaGVhZGVycyxcbiAgICAgIGF1dGhvcml6YXRpb246IHRva2VuID8gYEJlYXJlciAke3Rva2VufWAgOiBcIlwiXG4gICAgfVxuICB9O1xufSk7XG5cbmNvbnN0IGVycm9yTGluayA9ICh7b25Vc2VyRXJyb3IsIG9uTmV0d29ya0Vycm9yfSkgPT4gb25FcnJvcihlcnJvciA9PiB7XG4gaWYoZXJyb3IubmV0d29ya0Vycm9yICYmIG9uTmV0d29ya0Vycm9yKXtcbiAgIG9uTmV0d29ya0Vycm9yKGVycm9yLm5ldHdvcmtFcnJvcik7XG4gfSBlbHNlIGlmKGVycm9yLmdyYXBoUUxFcnJvcnMgJiYgb25Vc2VyRXJyb3IpIHtcbiAgIGVycm9yLmdyYXBoUUxFcnJvcnMuZm9yRWFjaChvblVzZXJFcnJvcik7XG4gfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjbGllbnQ6ICh1cmksIG9wdHMgPSB7fSkgPT4ge1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBBcG9sbG9DbGllbnQoe1xuICAgICAgbGluazogZXJyb3JMaW5rKG9wdHMpLmNvbmNhdChhdXRoTGluayhvcHRzLnRva2VuKS5jb25jYXQobmV3IEh0dHBMaW5rKHsgdXJpLCBmZXRjaCB9KSkpLFxuICAgICAgY2FjaGVcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgaW5zdGFuY2VzOiByZXF1aXJlKFwiLi9pbnN0YW5jZXNcIikoY2xpZW50KSxcbiAgICAgIGFwcHM6IHJlcXVpcmUoXCIuL2FwcHNcIikoY2xpZW50KSxcbiAgICAgIGJ1Y2tldHM6IHJlcXVpcmUoXCIuL2J1Y2tldHNcIikoY2xpZW50KSxcbiAgICAgIGRhdGFzdG9yZXM6IHJlcXVpcmUoXCIuL2RhdGFzdG9yZXNcIikoY2xpZW50KSxcbiAgICAgIHJlc291cmNlczogcmVxdWlyZShcIi4vcmVzb3VyY2VzXCIpKGNsaWVudCksXG4gICAgICBhcHBzdG9yZWFwcHM6IHJlcXVpcmUoXCIuL2FwcHN0b3JlYXBwc1wiKShjbGllbnQpLFxuICAgICAgY3VycmVudFVzZXI6IHJlcXVpcmUoXCIuL2N1cnJlbnQtdXNlclwiKShjbGllbnQpLFxuICAgICAgcmVzZXQ6ICgpID0+IGNsaWVudC5yZXNldFN0b3JlKCksXG4gICAgICBhcG9sbG9DbGllbnQ6IGNsaWVudCxcbiAgICB9O1xuICB9LFxuICBzdWJzY3JpcHRpb25zOiAodXJpLCB0b2tlbiwgb3B0aW9ucyA9IHsgcmVjb25uZWN0OiB0cnVlIH0sIHdlYlNvY2tldEltcGwpID0+IHtcbiAgICBvcHRpb25zLmNvbm5lY3Rpb25QYXJhbXMgPSB7IHRva2VuIH1cbiAgICBjb25zdCB3c0xpbmsgPSBuZXcgV2ViU29ja2V0TGluayh7IHVyaSwgb3B0aW9ucywgd2ViU29ja2V0SW1wbCB9KTtcbiAgICBjb25zdCB3c2NsaWVudCA9IG5ldyBBcG9sbG9DbGllbnQoe1xuICAgICAgbGluazogd3NMaW5rLFxuICAgICAgY2FjaGUsXG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGluc3RhbmNlczogcmVxdWlyZShcIi4vc3Vic2NyaXB0aW9ucy9pbnN0YW5jZXNcIikod3NjbGllbnQpLFxuICAgICAgYXBwczogcmVxdWlyZShcIi4vc3Vic2NyaXB0aW9ucy9hcHBzXCIpKHdzY2xpZW50KSxcbiAgICAgIGJ1Y2tldHM6IHJlcXVpcmUoXCIuL3N1YnNjcmlwdGlvbnMvYnVja2V0c1wiKSh3c2NsaWVudCksXG4gICAgICByZXNvdXJjZXM6IHJlcXVpcmUoXCIuL3N1YnNjcmlwdGlvbnMvcmVzb3VyY2VzXCIpKHdzY2xpZW50KSxcbiAgICAgIHJlc2V0OiAoKSA9PiB7XG4gICAgICAgIHdzY2xpZW50LnJlc2V0U3RvcmUoKTtcbiAgICAgICAgd3NMaW5rLnN1YnNjcmlwdGlvbkNsaWVudC5yZWNvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgd3NMaW5rLnN1YnNjcmlwdGlvbkNsaWVudC5jbGllbnQuY2xvc2UoKVxuICAgICAgfSxcbiAgICAgIGFwb2xsb0NsaWVudDogd3NjbGllbnQsXG4gICAgfTtcbiAgfVxufTtcbiJdfQ==