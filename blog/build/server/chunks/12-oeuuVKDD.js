import { f as fail } from './index-BkmUvga9.js';
import { deleteCourse, getAllCourses } from './database-BjMeOB2B.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async () => {
  const courses = await getAllCourses();
  return { courses };
};
const actions = {
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get("id"));
    if (isNaN(id)) return fail(400, { message: "ID inválido" });
    try {
      await deleteCourse(id);
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500, { message: "Erro ao deletar curso" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 12;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DlAHZq9c.js')).default;
const server_id = "src/routes/admin/courses/+page.server.ts";
const imports = ["_app/immutable/nodes/12.DNHCU4Op.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/4SgIdhTS.js"];
const stylesheets = ["_app/immutable/assets/12.BK9ZlzYP.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-oeuuVKDD.js.map
