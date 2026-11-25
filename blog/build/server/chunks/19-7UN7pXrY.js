import { f as fail } from './index-BkmUvga9.js';
import { getActiveNewsletterEmails, getSettings, createNewsletterCampaign, deleteNewsletterSubscriber, getNewsletterSubscribers, getNewsletterCampaigns } from './database-GQg0oTqt.js';
import { i as isResendConfigured, s as sendNewsletterCampaignEmail } from './resend-DJzwJZYF.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async ({ url }) => {
  const page = parseInt(url.searchParams.get("page") || "1");
  const search = url.searchParams.get("q") || "";
  const campaignPage = parseInt(url.searchParams.get("cpage") || "1");
  const subscribersData = await getNewsletterSubscribers(page, 20, search);
  const campaignsData = await getNewsletterCampaigns(campaignPage, 10);
  const settings = await getSettings();
  const resendReady = await isResendConfigured();
  const activeEmails = await getActiveNewsletterEmails();
  return {
    ...subscribersData,
    ...campaignsData,
    searchQuery: search,
    activeCount: activeEmails.length,
    activeEmails,
    resendReady,
    siteTitle: settings.site_title || "Blog",
    siteUrl: settings.site_url || url.origin
  };
};
const actions = {
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id");
    if (!id) {
      return fail(400, { error: "NL_ID_REQUIRED" });
    }
    try {
      await deleteNewsletterSubscriber(parseInt(id));
      return { success: true, message: "NL_DELETE_SUCCESS" };
    } catch (e) {
      console.error("Error deleting subscriber:", e);
      return fail(500, { error: "NL_DELETE_FAIL" });
    }
  },
  sendCampaign: async ({ request, url }) => {
    const data = await request.formData();
    const subject = data.get("subject");
    const content = data.get("content");
    const youtubeVideoUrl = data.get("youtube_video_url") || null;
    const sendTo = data.get("send_to");
    if (!subject || !content) {
      return fail(400, { error: "NL_SUBJECT_CONTENT" });
    }
    const resendReady = await isResendConfigured();
    if (!resendReady) {
      return fail(400, { error: "NL_RESEND_NOT_CONFIGURED" });
    }
    try {
      let emails = [];
      if (sendTo === "all") {
        emails = await getActiveNewsletterEmails();
      } else {
        const selectedEmailsRaw = data.get("selected_emails");
        emails = selectedEmailsRaw ? selectedEmailsRaw.split(",").map((e) => e.trim()).filter(Boolean) : [];
      }
      if (emails.length === 0) {
        return fail(400, { error: "NL_NO_RECIPIENTS" });
      }
      const settings = await getSettings();
      const siteName = settings.site_title || "Blog";
      const siteUrl = (settings.site_url || url.origin).replace(/\/$/, "");
      const success = await sendNewsletterCampaignEmail(
        emails,
        subject,
        content,
        youtubeVideoUrl,
        siteName,
        siteUrl
      );
      if (!success) {
        return fail(500, { error: "NL_SEND_FAIL" });
      }
      await createNewsletterCampaign({
        subject,
        content,
        youtubeVideoUrl: youtubeVideoUrl || void 0,
        recipientsCount: emails.length
      });
      return {
        success: true,
        message: "NL_CAMPAIGN_SENT",
        subject,
        count: emails.length
      };
    } catch (e) {
      console.error("Error executing campaign delivery action:", e);
      return fail(500, { error: "NL_SERVER_ERROR" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 19;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BGCQn6Kn.js')).default;
const server_id = "src/routes/admin/newsletter/+page.server.ts";
const imports = ["_app/immutable/nodes/19.CzCGOsFE.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/RDz6Ocgh.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/DDxGXZt_.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/CCgN62RU.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/D5_HPCL3.js"];
const stylesheets = ["_app/immutable/assets/19.B4s4w86a.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=19-7UN7pXrY.js.map
