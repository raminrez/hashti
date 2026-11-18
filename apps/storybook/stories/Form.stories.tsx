import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { Button, Input, TextArea, Theme, useTheme } from "@hashti/react";
import "./forms.css";

type SaveResult = Record<string, string> | void;
type SaveRequest = (values: FormData, attempt: number, signal: AbortSignal) => Promise<SaveResult>;

function simulateSave(
  _values: FormData,
  attempt: number,
  signal: AbortSignal,
): Promise<SaveResult> {
  if (signal.aborted) return Promise.reject(signal.reason);
  return new Promise<SaveResult>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      if (attempt === 1) reject(new Error("The first example request fails."));
      else resolve(undefined);
    }, 800);
    signal.addEventListener("abort", abort, { once: true });
  });
}

const serverErrors = {
  workspace: "This workspace name is already used. Choose a different name.",
  email: "This address cannot receive workspace updates. Use another contact email.",
};

function simulateServerResponse(
  _values: FormData,
  attempt: number,
  signal: AbortSignal,
): Promise<SaveResult> {
  if (signal.aborted) return Promise.reject(signal.reason);
  return Promise.resolve(attempt === 1 ? serverErrors : {});
}

const saveDraft = fn(simulateSave);
const saveWithFieldErrors = fn(simulateServerResponse);

const meta = {
  title: "Forms/Form",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "A native form with Hashti inputs. These local-only examples use ui-sdk Field native validation, persistent guidance, application-owned request state, and server-returned errors passed through the field's invalid and errorMessage props. Submitting preserves the draft instead of using an auto-resetting action.",
      },
    },
  },
  beforeEach: () => {
    saveDraft.mockReset().mockImplementation(simulateSave);
    saveWithFieldErrors.mockReset().mockImplementation(simulateServerResponse);
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type FormCopy = {
  formName: string;
  intro: ReactNode;
  nameLabel: string;
  nameHint: string;
  nameMissing: string;
  emailLabel: string;
  emailHint: ReactNode;
  emailMissing: string;
  emailInvalid: ReactNode;
  notesLabel: string;
  notesHint: string;
  defaultName: string;
  defaultNotes: string;
  saveLabel: string;
  pendingLabel: string;
  failure: string;
  fieldFailure: string;
  success: string;
};

const englishCopy: FormCopy = {
  formName: "Workspace draft",
  intro: "Local example: the first save fails; retry succeeds. No request leaves this page.",
  nameLabel: "Workspace name",
  nameHint: "Use the name your team will recognize.",
  nameMissing: "Enter a workspace name.",
  emailLabel: "Contact email",
  emailHint: (
    <>
      Workspace updates go to this address. For example, <bdi dir="ltr">review@example.com</bdi>.
    </>
  ),
  emailMissing: "Enter a contact email.",
  emailInvalid: "Enter a complete email address, such as review@example.com.",
  notesLabel: "Review notes",
  notesHint: "Keep these notes while correcting the required fields.",
  defaultName: "Weekly review",
  defaultNotes: "Keep the handoff checklist.",
  saveLabel: "Save draft",
  pendingLabel: "Saving draft",
  failure: "Draft was not saved. Your entries are still here. Choose Save draft to try again.",
  fieldFailure: "Nothing was saved. Review the field messages, then choose Save draft again.",
  success: "Draft saved locally. Your entries are still here.",
};

const persianCopy: FormCopy = {
  formName: "پیش‌نویس فضای کاری فارسی",
  intro: (
    <>
      نمونهٔ محلی برای فضای کاری <bdi dir="ltr">WS-1042</bdi>. اولین ذخیره ناموفق است؛ تلاش بعدی
      موفق می‌شود. هیچ درخواستی از این صفحه خارج نمی‌شود.
    </>
  ),
  nameLabel: "نام فضای کاری",
  nameHint: "نامی بنویسید که تیم شما بشناسد.",
  nameMissing: "نام فضای کاری را وارد کنید.",
  emailLabel: "ایمیل تماس",
  emailHint: (
    <>
      پیام‌های فضای کاری به این نشانی فرستاده می‌شوند. نمونه:{" "}
      <bdi dir="ltr">review@example.com</bdi>
    </>
  ),
  emailMissing: "ایمیل تماس را وارد کنید.",
  emailInvalid: (
    <>
      ایمیل را با قالب کامل وارد کنید؛ مثلاً <bdi dir="ltr">review@example.com</bdi>.
    </>
  ),
  notesLabel: "یادداشت‌های مرور",
  notesHint: "هنگام اصلاح بخش‌های الزامی، این یادداشت‌ها حفظ می‌شوند.",
  defaultName: "گزارش تیم تهران",
  defaultNotes: "یادداشت‌های جلسه برای مرور هفتگی تیم تهران.",
  saveLabel: "ذخیرهٔ پیش‌نویس",
  pendingLabel: "در حال ذخیرهٔ پیش‌نویس",
  failure:
    "پیش‌نویس ذخیره نشد. نوشته‌های شما حفظ شده‌اند. برای تلاش دوباره، «ذخیرهٔ پیش‌نویس» را بزنید.",
  fieldFailure: "چیزی ذخیره نشد. پیام‌های خطا را بررسی کنید و دوباره «ذخیرهٔ پیش‌نویس» را بزنید.",
  success: "پیش‌نویس در همین صفحه ذخیره شد. نوشته‌های شما حفظ شده‌اند.",
};

const arabicCopy: FormCopy = {
  formName: "مسودة مساحة العمل العربية",
  intro: (
    <>
      مثال محلي لمساحة العمل <bdi dir="ltr">WS-1042</bdi>. تفشل محاولة الحفظ الأولى وتنجح المحاولة
      التالية. لا يغادر أي طلب هذه الصفحة.
    </>
  ),
  nameLabel: "اسم مساحة العمل",
  nameHint: "استخدم اسمًا يعرفه فريقك.",
  nameMissing: "أدخل اسم مساحة العمل.",
  emailLabel: "بريد التواصل",
  emailHint: (
    <>
      تُرسل تحديثات مساحة العمل إلى هذا العنوان. مثال: <bdi dir="ltr">review@example.com</bdi>
    </>
  ),
  emailMissing: "أدخل بريد التواصل.",
  emailInvalid: (
    <>
      أدخل عنوان بريد كاملًا، مثل <bdi dir="ltr">review@example.com</bdi>.
    </>
  ),
  notesLabel: "ملاحظات المراجعة",
  notesHint: "تبقى هذه الملاحظات أثناء تصحيح الحقول المطلوبة.",
  defaultName: "مراجعة فريق القاهرة",
  defaultNotes: "ملاحظات الاجتماع وقائمة التسليم للمراجعة الأسبوعية.",
  saveLabel: "حفظ المسودة",
  pendingLabel: "جارٍ حفظ المسودة",
  failure: "لم تُحفظ المسودة. ما كتبته ما زال هنا. اختر «حفظ المسودة» للمحاولة مرة أخرى.",
  fieldFailure: "لم يُحفظ شيء. راجع رسائل الحقول ثم اختر «حفظ المسودة» مرة أخرى.",
  success: "حُفظت المسودة محليًا. ما كتبته ما زال هنا.",
};

function DraftForm({
  copy = englishCopy,
  empty = false,
  submit = saveDraft,
}: {
  copy?: FormCopy;
  empty?: boolean;
  submit?: SaveRequest;
}) {
  const [phase, setPhase] = useState<"idle" | "pending" | "error" | "field-error" | "saved">(
    "idle",
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const attempts = useRef(0);
  const request = useRef<AbortController | null>(null);
  const pending = phase === "pending";
  useEffect(() => () => request.current?.abort(), []);

  return (
    <div className="form-story-shell">
      <form
        aria-label={copy.formName}
        className="form-story-form"
        onSubmit={async (event) => {
          event.preventDefault();
          if (request.current) return;
          const values = new FormData(event.currentTarget);
          const controller = new AbortController();
          request.current = controller;
          setFieldErrors({});
          setPhase("pending");
          try {
            const errors = await submit(values, ++attempts.current, controller.signal);
            if (!controller.signal.aborted) {
              setFieldErrors(errors ?? {});
              setPhase(errors && Object.keys(errors).length ? "field-error" : "saved");
            }
          } catch {
            if (!controller.signal.aborted) setPhase("error");
          } finally {
            if (request.current === controller) request.current = null;
          }
        }}
      >
        <p className="form-story-intro">{copy.intro}</p>
        <Input
          name="workspace"
          label={copy.nameLabel}
          description={copy.nameHint}
          defaultValue={empty ? "" : copy.defaultName}
          required
          readOnly={pending}
          invalid={fieldErrors.workspace ? true : undefined}
          errorMessage={fieldErrors.workspace ?? copy.nameMissing}
        />
        <Input
          name="email"
          type="email"
          autoComplete="email"
          label={copy.emailLabel}
          description={copy.emailHint}
          defaultValue={empty ? "" : "review@example.com"}
          className="form-story-latin-value"
          required
          readOnly={pending}
          invalid={fieldErrors.email ? true : undefined}
          errorMessage={fieldErrors.email ?? copy.emailMissing}
        />
        <TextArea
          name="notes"
          label={copy.notesLabel}
          description={copy.notesHint}
          defaultValue={copy.defaultNotes}
          rows={3}
          isOptional
          readOnly={pending}
        />
        <div className="form-story-commit">
          <div className="form-story-feedback">
            {(phase === "error" || phase === "field-error") && (
              <p role="alert" className="form-story-error">
                {phase === "field-error" ? copy.fieldFailure : copy.failure}
              </p>
            )}
            <p role="status">{phase === "saved" ? copy.success : ""}</p>
          </div>
          <Button type="submit" disabled={pending} pendingLabel={copy.pendingLabel}>
            {copy.saveLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}

export const SaveAndRetry: Story = {
  render: () => <DraftForm />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole<HTMLFormElement>("form", { name: englishCopy.formName });
    const name = canvas.getByRole<HTMLInputElement>("textbox", {
      name: `${englishCopy.nameLabel} (required)`,
    });
    const notes = canvas.getByRole<HTMLTextAreaElement>("textbox", {
      name: `${englishCopy.notesLabel} (optional)`,
    });
    const button = canvas.getByRole("button", { name: englishCopy.saveLabel });
    await expect(name).toBeRequired();
    await expect(notes).not.toBeRequired();
    await userEvent.click(notes);
    await userEvent.type(notes, " Add the owner handoff.");
    await userEvent.click(button);
    await expect(saveDraft).toHaveBeenCalledTimes(1);
    await expect(Object.fromEntries(saveDraft.mock.calls[0]?.[0] ?? [])).toEqual({
      workspace: englishCopy.defaultName,
      email: "review@example.com",
      notes: "Keep the handoff checklist. Add the owner handoff.",
    });
    await expect(await canvas.findByRole("alert")).toHaveTextContent(englishCopy.failure);
    await expect(name).toHaveValue(englishCopy.defaultName);
    await userEvent.click(button);
    await expect(saveDraft).toHaveBeenCalledTimes(2);
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent(englishCopy.success),
    );
  },
};

export const ServerFieldErrors: Story = {
  render: () => (
    <DraftForm
      submit={saveWithFieldErrors}
      copy={{ ...englishCopy, formName: "Server field recovery" }}
    />
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole<HTMLInputElement>("textbox", {
      name: `${englishCopy.nameLabel} (required)`,
    });
    const email = canvas.getByRole<HTMLInputElement>("textbox", {
      name: `${englishCopy.emailLabel} (required)`,
    });
    const button = canvas.getByRole("button", { name: englishCopy.saveLabel });
    await expect(canvas.queryByText(serverErrors.workspace)).not.toBeInTheDocument();
    await userEvent.click(button);
    await expect(saveWithFieldErrors).toHaveBeenCalledTimes(1);
    await expect(await canvas.findByText(serverErrors.workspace)).toBeVisible();
    await expect(await canvas.findByText(serverErrors.email)).toBeVisible();
    await expect(name.closest(".hashti-field")).toHaveAttribute("data-invalid");
    await expect(email.closest(".hashti-field")).toHaveAttribute("data-invalid");
    await userEvent.click(name);
    await userEvent.clear(name);
    await userEvent.type(name, "Delivery review");
    await userEvent.click(email);
    await userEvent.clear(email);
    await userEvent.type(email, "delivery.review@example.com");
    await userEvent.click(button);
    await expect(saveWithFieldErrors).toHaveBeenCalledTimes(2);
    await waitFor(() =>
      expect(canvas.getByRole("status")).toHaveTextContent(englishCopy.success),
    );
  },
};

export const NativeValidation: Story = {
  render: () => <DraftForm empty />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole<HTMLInputElement>("textbox", {
      name: `${englishCopy.nameLabel} (required)`,
    });
    const email = canvas.getByRole<HTMLInputElement>("textbox", {
      name: `${englishCopy.emailLabel} (required)`,
    });
    const button = canvas.getByRole("button", { name: englishCopy.saveLabel });
    await expect(canvas.queryByText(englishCopy.nameMissing)).not.toBeInTheDocument();
    // Empty required fields block the native submit and show their recovery.
    await userEvent.click(button);
    await expect(await canvas.findByText(englishCopy.nameMissing)).toBeVisible();
    await expect(await canvas.findByText(englishCopy.emailMissing)).toBeVisible();
    await expect(saveDraft).not.toHaveBeenCalled();
    await userEvent.click(name);
    await userEvent.type(name, "Release review");
    await userEvent.click(email);
    await userEvent.type(email, "release.review@example.com");
    await userEvent.click(button);
    await expect(saveDraft).toHaveBeenCalledTimes(1);
  },
};

function RightToLeftExample() {
  const { theme } = useTheme();
  return (
    <div className="form-story-locales">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <DraftForm copy={persianCopy} empty />
      </Theme>
      <Theme theme={theme} lang="ar" dir="rtl">
        <DraftForm copy={arabicCopy} empty />
      </Theme>
    </div>
  );
}

export const RightToLeft: Story = {
  render: RightToLeftExample,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    for (const [copy, locale, contact, required, optional] of [
      [persianCopy, "fa-IR", "tehran.review@example.com", "الزامی", "اختیاری"],
      [arabicCopy, "ar", "cairo.review@example.com", "مطلوب", "اختياري"],
    ] as const) {
      const form = canvas.getByRole<HTMLFormElement>("form", { name: copy.formName });
      const scope = within(form);
      const localeRoot = form.closest("[lang]")!;
      const name = scope.getByRole<HTMLInputElement>("textbox", {
        name: `${copy.nameLabel} (${required})`,
      });
      const email = scope.getByRole<HTMLInputElement>("textbox", {
        name: `${copy.emailLabel} (${required})`,
      });
      const button = scope.getByRole("button", { name: copy.saveLabel });
      await expect(localeRoot).toHaveAttribute("lang", locale);
      await expect(localeRoot).toHaveAttribute("dir", "rtl");
      await expect(name).toBeRequired();
      await expect(email).toBeRequired();
      await userEvent.click(button);
      await expect(await scope.findByText(copy.nameMissing)).toBeVisible();
      await expect(await scope.findByText(copy.emailMissing)).toBeVisible();
      await userEvent.click(name);
      await userEvent.type(name, copy.defaultName);
      await userEvent.click(email);
      await userEvent.type(email, contact);
      await userEvent.click(button);
    }
  },
};
