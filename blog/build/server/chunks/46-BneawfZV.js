import { r as redirect } from './index-BkmUvga9.js';

const load = async () => {
  throw redirect(303, "/");
};
const actions = {
  default: async ({ cookies }) => {
    cookies.delete("member_session", { path: "/" });
    throw redirect(303, "/");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 46;
const server_id = "src/routes/members/logout/+page.server.ts";
const imports = [];
const stylesheets = [];
const fonts = [];

export { fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=46-BneawfZV.js.map
