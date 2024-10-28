try {
  //Vars for API.
  const apiroot = "api";
  const apiver = "v1";
  const apipath = `${apiroot}/${apiver}`;

  // Import middleware, security, and authentication routes.
  const auth = require("./security/authenticate/auth");
  const login = require("./security/authenticate/login");
  const passwordgen = require("../middleware/password-gen");
  const profile = require("./security/profile/profile");
  const profile_user = require("./security/profile/user/user"); //For Firestarters Nuxt3
  const reset_password = require("./security/reset-password/reset-password");
  const register = require("./security/register/register");
  const security_key = require("./security/key/security-key");
  const user_security_key_rel = require("./security/key/user-security-key-rel");

  // Import utility routes.
  const country = require("./utils/country/country");
  const day = require("./utils/day/day");
  const email = require("./utils/email/email");
  const industry = require("./utils/industry/industry");
  const locale = require("./utils/locale/locale");
  const locale_language = require("./utils/locale/language");
  const log = require("./utils/log/log");
  const log_type = require("./utils/log/log-type");
  const mobile_carrier = require("./utils/mobilecarrier/mobile-carrier");
  const notification = require("./utils/notification/notification");
  const social_network_share = require("./utils/social/social-network-share");
  const state_prov = require("./utils/stateprov/state-prov");
  const time = require("./utils/time/time");

  // Import report routes.
  const analytics_page_view = require("./report/analytics/analytics-page-view");
  const rv_event_user_rsvp_rel = require("./report/event/rv-event-user-rsvp-rel");
  const rv_user = require("./report/user/rv-user");

  // Import application routes.
  const address = require("./apps/address/address");
  const address_type = require("./apps/address/address-type");

  const alert = require("./apps/alert/alert");
  const alert_priority = require("./apps/alert/alert-priority");
  const alert_type = require("./apps/alert/alert-type");

  const application = require("./apps/application/application");
  const application_type = require("./apps/application/application-type");
  const application_property = require("./apps/application/application-property");
  const application_property_type = require("./apps/application/application-property-type");

  const brand = require("./apps/brand/brand");
  const brand_business_channel_rel = require("./apps/brand/brand-business-channel-rel");
  const brand_country_rel = require("./apps/brand/brand-country-rel");
  const brand_erp_region_rel = require("./apps/brand/brand-erp-region-rel");
  const brand_industry_rel = require("./apps/brand/brand-industry-rel");

  const business_channel = require("./apps/businesschannel/business-channel");
  const business_function = require("./apps/businessfunction/business-function");

  const content = require("./apps/content/content");
  const content_author_user_rel = require("./apps/content/content-author-user-rel");
  const content_document_rel = require("./apps/content/content-document-rel");
  const content_industry_rel = require("./apps/content/content-industry-rel");
  const content_related_rel = require("./apps/content/content-related-rel");
  const content_video_rel = require("./apps/content/content-video-rel");

  const document = require("./apps/document/document");
  const document_type = require("./apps/document/document-type");

  const erp_region = require("./apps/erpregion/erp-region");

  const event = require("./apps/event/event");
  const event_business_channel_rel = require("./apps/event/event-business-channel-rel");
  const event_delivery_type = require("./apps/event/event-delivery-type");
  const event_document_rel = require("./apps/event/event-document-rel");
  const event_industry_rel = require("./apps/event/event-industry-rel");
  const event_register = require("./apps/event/event-register");
  const event_related_rel = require("./apps/event/event-related-rel");
  const event_schedule_rel = require("./apps/event/event-schedule-rel");
  const event_type = require("./apps/event/event-type");
  const event_user_rsvp_rel = require("./apps/event/event-user-rsvp-rel");

  const forum_tag = require("./apps/forum/forum-tag");

  const image = require("./apps/image/image");
  const image_type = require("./apps/image/image-type");

  const information = require("./apps/information/information");
  const information_type = require("./apps/information/information-type");

  const job_role = require("./apps/jobrole/job-role");

  const navigation = require("./apps/navigation/navigation");
  const navigation_type = require("./apps/navigation/navigation-type");

  const sort = require("./apps/sort/sort");
  const status = require("./apps/status/status");

  const user = require("./apps/user/user");
  const user_address_rel = require("./apps/user/user-address-rel");
  const user_business_channel_rel = require("./apps/user/user-business-channel-rel");
  const user_comment = require("./apps/user/user-comment");
  const user_comment_like = require("./apps/user/user-comment-like");
  const user_comment_share = require("./apps/user/user-comment-share");
  const user_erp_region_rel = require("./apps/user/user-erp-region-rel");
  const user_field = require("./apps/user/user-field");
  const user_field_type = require("./apps/user/user-field-type");
  const user_field_rel = require("./apps/user/user-field-rel");
  const user_forum_tag_rel = require("./apps/user/user-forum-tag-rel");
  const user_industry_rel = require("./apps/user/user-industry-rel");
  const user_member = require("./apps/user/user-member");
  const user_member_rel = require("./apps/user/user-member-rel");
  const user_member_preference_rel = require("./apps/user/user-member-preference-rel");
  const user_preference = require("./apps/user/user-preference");
  const user_title = require("./apps/user/user-title");
  const user_title_type = require("./apps/user/user-title-type");
  const user_type = require("./apps/user/user-type");

  // Import interface routes.
  //VLM routes.
  const vlm_auth_forgot_password = require("./interface/vlm/auth/forgot-password");
  const vlm_auth_login = require("./interface/vlm/auth/login");
  const vlm_auth_register = require("./interface/vlm/auth/register");
  const vlm_auth_reset_password = require("./interface/vlm/auth/reset-password");
  const vlm_auth_unsubscribe = require("./interface/vlm/auth/unsubscribe");
  const vlm_enroll = require("./interface/vlm/enroll/enroll");
  const vlm_report = require("./interface/vlm/report/download");
  const vlm_request_meeting = require("./interface/vlm/request/meeting");
  const vlm_survey_list = require("./interface/vlm/survey/list");
  const vlm_survey_save_response = require("./interface/vlm/survey/save-response");
  const vlm_survey = require("./interface/vlm/survey/survey");

  //Emarsys routes.
  const emarsys_auth = require("./security/authenticate/interface/emarsys-auth");
  const emarsys_contact = require("./interface/emarsys/contact/contact");
  const emarsys_contact_optout = require("./interface/emarsys/contact/optout");
  const emarsys_event = require("./interface/emarsys/event/trigger");
  const emarsys_user = require("./interface/emarsys/contact/user");
  const emarsys_field_choices = require("./interface/emarsys/field/field-choices");

  //Export the routes.
  module.exports = (app) => {
    // Middleware, security, and authentication routes.
    app.use(`/${apipath}/auth`, auth);
    app.use(`/${apipath}/login`, login);
    app.use(`/${apipath}/passwordgen`, passwordgen);
    app.use(`/${apipath}/profile`, profile);
    app.use(`/${apipath}/profile-user`, profile_user);
    app.use(`/${apipath}/reset-password`, reset_password);
    app.use(`/${apipath}/register`, register);
    app.use(`/${apipath}/security-key`, security_key);
    app.use(`/${apipath}/user-security-key-rel`, user_security_key_rel);

    // Utility routes.
    app.use(`/${apipath}/country`, country);
    app.use(`/${apipath}/day`, day);
    app.use(`/${apipath}/email`, email);
    app.use(`/${apipath}/industry`, industry);
    app.use(`/${apipath}/locale`, locale);
    app.use(`/${apipath}/locale-language`, locale_language);
    app.use(`/${apipath}/log`, log);
    app.use(`/${apipath}/log-type`, log_type);
    app.use(`/${apipath}/mobile-carrier`, mobile_carrier);
    app.use(`/${apipath}/notification`, notification);
    app.use(`/${apipath}/social-network-share`, social_network_share);
    app.use(`/${apipath}/stateprov`, state_prov);
    app.use(`/${apipath}/time`, time);

    // Report routes.
    app.use(`/${apipath}/analytics-page-view`, analytics_page_view);
    app.use(`/${apipath}/rv-event-user-rsvp-rel`, rv_event_user_rsvp_rel);
    app.use(`/${apipath}/rv-user`, rv_user);

    // Application routes.
    app.use(`/${apipath}/address`, address);
    app.use(`/${apipath}/address-type`, address_type);

    app.use(`/${apipath}/alert`, alert);
    app.use(`/${apipath}/alert-priority`, alert_priority);
    app.use(`/${apipath}/alert-type`, alert_type);

    app.use(`/${apipath}/application`, application);
    app.use(`/${apipath}/application-type`, application_type);
    app.use(`/${apipath}/application-property`, application_property);
    app.use(`/${apipath}/application-property-type`, application_property_type);

    app.use(`/${apipath}/brand`, brand);
    app.use(
      `/${apipath}/brand-business-channel-rel`,
      brand_business_channel_rel
    );
    app.use(`/${apipath}/brand-country-rel`, brand_country_rel);
    app.use(`/${apipath}/brand-erp-region-rel`, brand_erp_region_rel);
    app.use(`/${apipath}/brand-industry-rel`, brand_industry_rel);

    app.use(`/${apipath}/business-channel`, business_channel);
    app.use(`/${apipath}/business-function`, business_function);

    app.use(`/${apipath}/content`, content);
    app.use(`/${apipath}/content-author-user-rel`, content_author_user_rel);
    app.use(`/${apipath}/content-document-rel`, content_document_rel);
    app.use(`/${apipath}/content-industry-rel`, content_industry_rel);
    app.use(`/${apipath}/content-related-rel`, content_related_rel);
    app.use(`/${apipath}/content-video-rel`, content_video_rel);

    app.use(`/${apipath}/document`, document);
    app.use(`/${apipath}/document-type`, document_type);

    app.use(`/${apipath}/erp-region`, erp_region);

    app.use(`/${apipath}/event`, event);
    app.use(
      `/${apipath}/event-business-channel-rel`,
      event_business_channel_rel
    );
    app.use(`/${apipath}/event-delivery-type`, event_delivery_type);
    app.use(`/${apipath}/event-document-rel`, event_document_rel);
    app.use(`/${apipath}/event-industry-rel`, event_industry_rel);
    app.use(`/${apipath}/event-register`, event_register);
    app.use(`/${apipath}/event-related-rel`, event_related_rel);
    app.use(`/${apipath}/event-schedule-rel`, event_schedule_rel);
    app.use(`/${apipath}/event-type`, event_type);
    app.use(`/${apipath}/event-user-rsvp-rel`, event_user_rsvp_rel);

    app.use(`/${apipath}/forum-tag`, forum_tag);

    app.use(`/${apipath}/image`, image);
    app.use(`/${apipath}/image-type`, image_type);

    app.use(`/${apipath}/information`, information);
    app.use(`/${apipath}/information-type`, information_type);

    app.use(`/${apipath}/job-role`, job_role);

    app.use(`/${apipath}/navigation`, navigation);
    app.use(`/${apipath}/navigation-type`, navigation_type);

    app.use(`/${apipath}/sort`, sort);
    app.use(`/${apipath}/status`, status);

    app.use(`/${apipath}/user`, user);
    app.use(`/${apipath}/user-address-rel`, user_address_rel);
    app.use(`/${apipath}/user-business-channel-rel`, user_business_channel_rel);
    app.use(`/${apipath}/user-comment`, user_comment);
    app.use(`/${apipath}/user-comment-like`, user_comment_like);
    app.use(`/${apipath}/user-comment/like-count`, user_comment);
    app.use(`/${apipath}/user-comment/dislike-count`, user_comment);
    app.use(`/${apipath}/user-comment-share`, user_comment_share);
    app.use(`/${apipath}/user-comment/share-count`, user_comment);
    app.use(`/${apipath}/user-erp-region-rel`, user_erp_region_rel);
    app.use(`/${apipath}/user-field`, user_field);
    app.use(`/${apipath}/user-field-type`, user_field_type);
    app.use(`/${apipath}/user-field-rel`, user_field_rel);
    app.use(`/${apipath}/user-forum-tag-rel`, user_forum_tag_rel);
    app.use(`/${apipath}/user-industry-rel`, user_industry_rel);
    app.use(`/${apipath}/user-member`, user_member);
    app.use(`/${apipath}/user-member-rel`, user_member_rel);
    app.use(
      `/${apipath}/user-member-preference-rel`,
      user_member_preference_rel
    );
    app.use(`/${apipath}/user-preference`, user_preference);
    app.use(`/${apipath}/user-title`, user_title);
    app.use(`/${apipath}/user-title-type`, user_title_type);
    app.use(`/${apipath}/user-type`, user_type);

    //Interface routes.
    //VLM Routes
    app.use(`/${apipath}/vlm/auth/forgot-password`, vlm_auth_forgot_password);
    app.use(`/${apipath}/vlm/auth/login`, vlm_auth_login);
    app.use(`/${apipath}/vlm/auth/register`, vlm_auth_register);
    app.use(`/${apipath}/vlm/auth/reset-password`, vlm_auth_reset_password);
    app.use(`/${apipath}/vlm/auth/unsubscribe`, vlm_auth_unsubscribe);
    app.use(`/${apipath}/vlm/enroll`, vlm_enroll);
    app.use(`/${apipath}/vlm/report`, vlm_report);
    app.use(`/${apipath}/vlm/request/meeting`, vlm_request_meeting);
    app.use(`/${apipath}/vlm/survey/list`, vlm_survey_list);
    app.use(`/${apipath}/vlm/survey/save-response`, vlm_survey_save_response);
    app.use(`/${apipath}/vlm/survey`, vlm_survey);

    //Emarsys routes.
    app.use(`/${apipath}/emarsys/auth`, emarsys_auth);
    app.use(`/${apipath}/emarsys/contact`, emarsys_contact);
    app.use(`/${apipath}/emarsys/contact/optout`, emarsys_contact_optout);
    app.use(`/${apipath}/emarsys/contact-user`, emarsys_user);
    app.use(`/${apipath}/emarsys/event`, emarsys_event);
    app.use(`/${apipath}/emarsys/field-choices`, emarsys_field_choices);
  };
} catch (e) {
  app.get("/", function (req, res) {
    res.send("An error occurred with the default router.<hr/>" + e);
  });
}
