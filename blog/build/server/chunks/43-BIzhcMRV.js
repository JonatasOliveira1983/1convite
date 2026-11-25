import { r as redirect, e as error } from './index-BkmUvga9.js';
import { getSettings, getCourseBySlug, queryOne, hasUserPurchasedCourse, getLessonsByCourseId, getMaterialsByCourseId } from './database-GQg0oTqt.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async ({ params, locals, url }) => {
  const settings = await getSettings();
  if (settings.enable_member_login !== "1") throw redirect(303, "/");
  if (!locals.user) throw redirect(303, `/members/login?redirectTo=${encodeURIComponent(url.pathname)}`);
  const course = await getCourseBySlug(params.slug);
  if (!course || !course.published) throw error(404, "Curso não encontrado");
  const isAdmin = locals.user.role === "admin";
  const subscription = await queryOne(
    `SELECT id FROM premium_subscriptions WHERE user_id = ? AND status = 'active' AND (expires_at IS NULL OR expires_at > datetime('now'))`,
    [locals.user.id]
  );
  const hasPremium = !!subscription || isAdmin;
  let hasAccess = false;
  if (course.access_type === "free") hasAccess = true;
  else if (course.access_type === "premium") hasAccess = hasPremium;
  else if (course.access_type === "paid") {
    hasAccess = hasPremium || await hasUserPurchasedCourse(locals.user.id, course.id);
  }
  const allLessons = await getLessonsByCourseId(course.id, !isAdmin);
  const materials = await getMaterialsByCourseId(course.id);
  const lessonId = url.searchParams.get("aula");
  const selectedLesson = lessonId ? allLessons.find((l) => l.id === parseInt(lessonId)) ?? allLessons[0] : allLessons[0];
  const safeLessons = allLessons.map((l) => ({
    id: l.id,
    title: l.title,
    sort_order: l.sort_order,
    published: l.published,
    is_preview: l.is_preview,
    has_video: !!l.video_url,
    has_content: !!l.content
  }));
  const safeSelectedLesson = selectedLesson ? {
    id: selectedLesson.id,
    title: selectedLesson.title,
    content: selectedLesson.content,
    has_video: !!selectedLesson.video_url,
    video_type: selectedLesson.video_type,
    is_preview: selectedLesson.is_preview,
    published: selectedLesson.published
  } : null;
  return {
    course,
    lessons: safeLessons,
    selectedLesson: safeSelectedLesson,
    materials,
    hasAccess,
    hasPremium,
    user: locals.user,
    settings
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 43;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BQX23p7f.js')).default;
const server_id = "src/routes/members/area/[slug]/+page.server.ts";
const imports = ["_app/immutable/nodes/43.5M8R5mJ9.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/RDz6Ocgh.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/43.r8-yIjlm.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=43-BIzhcMRV.js.map
