import { r as redirect, f as fail, e as error } from './index-BkmUvga9.js';
import { deleteCourse, deleteMaterial, createMaterial, deleteLesson, updateLesson, getLessonsByCourseId, createLesson, generateUniqueCourseSlug, updateCourse, getCourseById, getMaterialsByCourseId } from './database-GQg0oTqt.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async ({ params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) throw error(404, "Curso não encontrado");
  const course = await getCourseById(id);
  if (!course) throw error(404, "Curso não encontrado");
  const lessons = await getLessonsByCourseId(id);
  const materials = await getMaterialsByCourseId(id);
  return { course, lessons, materials };
};
const actions = {
  updateCourse: async ({ request, params }) => {
    const id = parseInt(params.id);
    const data = await request.formData();
    const title = data.get("title")?.trim();
    const description = data.get("description")?.trim() || null;
    const cover_image = data.get("cover_image")?.trim() || null;
    const access_type = data.get("access_type") || "premium";
    const price_cents = Math.round(parseFloat((data.get("price") || "0").replace(",", ".")) * 100) || 0;
    const published = data.get("published") === "1" ? 1 : 0;
    if (!title) return fail(400, { courseError: "Título obrigatório" });
    const slug = await generateUniqueCourseSlug(title, id);
    await updateCourse(id, { title, slug, description, cover_image, access_type, price_cents, published });
    return { courseSuccess: "Curso atualizado!" };
  },
  addLesson: async ({ request, params }) => {
    const courseId = parseInt(params.id);
    const data = await request.formData();
    const title = data.get("title")?.trim();
    const content = data.get("content") || null;
    const video_url = data.get("video_url")?.trim() || null;
    const video_type = data.get("video_type") || "youtube";
    const topic = data.get("topic")?.trim() || null;
    const is_preview = data.get("is_preview") === "1" ? 1 : 0;
    const published = data.get("published") === "1" ? 1 : 0;
    if (!title) return fail(400, { lessonError: "Título da aula obrigatório" });
    const lessons = await getLessonsByCourseId(courseId);
    const sort_order = lessons.length;
    await createLesson({ course_id: courseId, title, content, video_url, video_type, topic, sort_order, published, is_preview });
    return { lessonSuccess: "Aula adicionada!" };
  },
  updateLesson: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get("lesson_id"));
    const title = data.get("title")?.trim();
    const content = data.get("content") || null;
    const video_url = data.get("video_url")?.trim() || null;
    const video_type = data.get("video_type") || "youtube";
    const topic = data.get("topic")?.trim() || null;
    const is_preview = data.get("is_preview") === "1" ? 1 : 0;
    const published = data.get("published") === "1" ? 1 : 0;
    const sort_order = parseInt(data.get("sort_order")) || 0;
    if (!title || isNaN(id)) return fail(400, { lessonError: "Dados inválidos" });
    await updateLesson(id, { title, content, video_url, video_type, topic, sort_order, published, is_preview });
    return { lessonSuccess: "Aula atualizada!" };
  },
  deleteLesson: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get("lesson_id"));
    if (isNaN(id)) return fail(400, { lessonError: "ID inválido" });
    await deleteLesson(id);
    return { lessonSuccess: "Aula removida!" };
  },
  addMaterial: async ({ request, params }) => {
    const courseId = parseInt(params.id);
    const data = await request.formData();
    const title = data.get("title")?.trim();
    const description = data.get("description")?.trim() || null;
    const file_url = data.get("file_url")?.trim();
    const file_type = data.get("file_type")?.trim() || null;
    if (!title || !file_url) return fail(400, { materialError: "Título e URL do arquivo são obrigatórios" });
    await createMaterial({ course_id: courseId, title, description, file_url, file_type });
    return { materialSuccess: "Material adicionado!" };
  },
  deleteMaterial: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get("material_id"));
    if (isNaN(id)) return fail(400, { materialError: "ID inválido" });
    await deleteMaterial(id);
    return { materialSuccess: "Material removido!" };
  },
  deleteCourse: async ({ params }) => {
    const id = parseInt(params.id);
    await deleteCourse(id);
    throw redirect(303, "/admin/courses");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 14;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DyxhIX_d.js')).default;
const server_id = "src/routes/admin/courses/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/14.DVx9a_Sf.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/CCgN62RU.js"];
const stylesheets = ["_app/immutable/assets/14.CBYpYOLH.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-B6GGPWHl.js.map
