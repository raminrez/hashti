import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { Button, Form, TextArea, TextField, Theme, useTheme, type FormProps } from "@hashti/react";
import "./forms.css";

type SaveResult = FormProps["validationErrors"] | void;
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
} satisfies NonNullable<FormProps["validationErrors"]>;

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
  component: Form,
  args: { onSubmit: fn() },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          "Form is Hashti's unchanged React Aria export. These local-only examples use default TextField/TextArea composition, native submit validation, persistent guidance, application-owned request state, and Form validationErrors. onSubmit preserves the draft instead of using an auto-resetting React action. Required wording and recovery are authored alongside the locale; isRequired supplies native behavior.",
      },
    },
  },
  beforeEach: () => {
    saveDraft.mockReset().mockImplementation(simulateSave);
    saveWithFieldErrors.mockReset().mockImplementation(simulateServerResponse);
  },
} satisfies Meta<typeof Form>;

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

const longRecovery = {
  name: "Enter a workspace name your team can recognize before saving this draft. Use the name from your team's review schedule rather than an internal project code. Your contact email and review notes will stay here while you make this correction, so you do not need to enter them again.",
  email:
    "Enter a complete contact email before saving this draft. Include both the mailbox and its domain, such as workspace-review-handoff-contact@example.com. Check the address with the person receiving the review, then return to Save draft. The workspace name and all of your notes will remain here.",
};

function DraftForm({
  copy = englishCopy,
  empty = false,
  recovery,
  submit = saveDraft,
  ...args
}: FormProps & {
  copy?: FormCopy;
  empty?: boolean;
  recovery?: typeof longRecovery;
  submit?: SaveRequest;
}) {
  const [phase, setPhase] = useState<"idle" | "pending" | "error" | "field-error" | "saved">(
    "idle",
  );
  const [validationErrors, setValidationErrors] = useState<FormProps["validationErrors"]>({});
  const attempts = useRef(0);
  const request = useRef<AbortController | null>(null);
  const pending = phase === "pending";
  useEffect(() => () => request.current?.abort(), []);

  return (
    <div className="form-story-shell">
      <Form
        {...args}
        aria-label={copy.formName}
        className="form-story-form"
        validationBehavior="native"
        validationErrors={validationErrors}
        onSubmit={async (event) => {
          event.preventDefault();
          // The button blocks activation; this guard also covers implicit/native submissions.
          if (request.current) return;
          const values = new FormData(event.currentTarget);
          const controller = new AbortController();
          request.current = controller;
          setValidationErrors({});
          setPhase("pending");
          try {
            args.onSubmit?.(event);
            const errors = await submit(values, ++attempts.current, controller.signal);
            if (!controller.signal.aborted) {
              setValidationErrors(errors ?? {});
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
        <TextField
          name="workspace"
          label={copy.nameLabel}
          description={copy.nameHint}
          defaultValue={empty ? "" : copy.defaultName}
          isRequired
          isReadOnly={pending}
          errorMessage={({ validationDetails, validationErrors }) =>
            validationDetails.valueMissing ? (recovery?.name ?? copy.nameMissing) : validationErrors
          }
        />
        <TextField
          name="email"
          type="email"
          autoComplete="email"
          label={copy.emailLabel}
          description={copy.emailHint}
          defaultValue={empty ? "" : "review@example.com"}
          className="form-story-latin-value"
          isRequired
          isReadOnly={pending}
          errorMessage={({ validationDetails, validationErrors }) => {
            if (validationDetails.valueMissing) return recovery?.email ?? copy.emailMissing;
            if (validationDetails.typeMismatch) return copy.emailInvalid;
            return validationErrors;
          }}
        />
        <TextArea
          name="notes"
          label={copy.notesLabel}
          description={copy.notesHint}
          defaultValue={copy.defaultNotes}
          rows={3}
          isOptional
          isReadOnly={pending}
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
      </Form>
    </div>
  );
}

function deferredRequest() {
  let complete!: (result: SaveResult) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<SaveResult>((resolvePromise, rejectPromise) => {
    complete = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve: (result?: FormProps["validationErrors"]) => complete(result), reject };
}

function fieldDescription(control: HTMLElement) {
  const description = control.parentElement?.querySelector<HTMLElement>(
    ".hashti-field__description",
  );
  if (!description) throw new Error("The default field must retain its description.");
  return description;
}

async function expectDescription(control: HTMLElement, initialId: string) {
  const description = fieldDescription(control);
  await expect(initialId).not.toBe("");
  await expect(description).toBeVisible();
  await expect(description.id).toBe(initialId);
  await expect(control.getAttribute("aria-describedby")?.split(/\s+/)).toContain(initialId);
}

function saveTop(form: HTMLElement, button: HTMLElement) {
  // Compare within the form so native focus scrolling is not mistaken for layout motion.
  return button.getBoundingClientRect().top - form.getBoundingClientRect().top;
}

export const NativeValidationAndRecovery: Story = {
  render: (args) => <DraftForm {...args} empty />,
  parameters: {
    docs: {
      description: {
        story:
          "Try Save with both required fields empty. Native/RAC validation focuses the first invalid input and keeps both instructions visible. The required fields reserve a form-specific recovery budget; pointer correction must not move Save. A valid submission snapshots the actual current FormData without resetting the draft.",
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole<HTMLFormElement>("form", { name: englishCopy.formName });
    const name = canvas.getByRole<HTMLInputElement>("textbox", {
      name: `${englishCopy.nameLabel} (required)`,
    });
    const email = canvas.getByRole<HTMLInputElement>("textbox", {
      name: `${englishCopy.emailLabel} (required)`,
    });
    const notes = canvas.getByRole<HTMLTextAreaElement>("textbox", {
      name: `${englishCopy.notesLabel} (optional)`,
    });
    const button = canvas.getByRole("button", { name: englishCopy.saveLabel });
    const nameDescriptionId = fieldDescription(name).id;
    const emailDescriptionId = fieldDescription(email).id;
    const request = deferredRequest();
    saveDraft.mockReturnValueOnce(request.promise);

    await expect(name).toBeRequired();
    await expect(email).toBeRequired();
    await expect(notes).not.toBeRequired();
    await expect(name).not.toHaveAttribute("aria-invalid", "true");
    await expect(email).not.toHaveAttribute("aria-invalid", "true");
    await expect(canvas.queryByText(englishCopy.nameMissing)).not.toBeInTheDocument();
    await expect(canvas.queryByText(englishCopy.emailMissing)).not.toBeInTheDocument();
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
    await userEvent.click(notes);
    await userEvent.clear(notes);
    await userEvent.type(notes, "Keep the revised handoff checklist.");
    await expect(canvas.queryByText(englishCopy.nameMissing)).not.toBeInTheDocument();
    const initialTop = saveTop(form, button);

    await userEvent.click(button);
    const nameError = await canvas.findByText(englishCopy.nameMissing);
    const emailError = await canvas.findByText(englishCopy.emailMissing);
    await expect(nameError).toBeVisible();
    await expect(emailError).toBeVisible();
    await waitFor(() => expect(name).toHaveFocus());
    await expect(saveDraft).not.toHaveBeenCalled();
    await expectDescription(name, nameDescriptionId);
    await expectDescription(email, emailDescriptionId);
    await expect(name.getAttribute("aria-describedby")?.split(/\s+/)).toContain(nameError.id);
    await expect(email.getAttribute("aria-describedby")?.split(/\s+/)).toContain(emailError.id);
    await expect(notes).toBeValid();
    await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);

    await userEvent.click(name);
    await userEvent.type(name, "Release review");
    await userEvent.click(email);
    await waitFor(() =>
      expect(canvas.queryByText(englishCopy.nameMissing)).not.toBeInTheDocument(),
    );
    await expect(canvas.getByText(englishCopy.emailMissing)).toBeVisible();
    await expectDescription(name, nameDescriptionId);
    await expectDescription(email, emailDescriptionId);
    await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);

    await userEvent.type(email, "not-an-email");
    await userEvent.click(button);
    await expect(
      await canvas.findByText("Enter a complete email address, such as review@example.com."),
    ).toBeVisible();
    await waitFor(() => expect(email).toHaveFocus());
    await expect(saveDraft).not.toHaveBeenCalled();
    await userEvent.click(email);
    await userEvent.clear(email);
    await userEvent.type(email, "release.review@example.com");
    await userEvent.click(notes);
    await expectDescription(name, nameDescriptionId);
    await expectDescription(email, emailDescriptionId);
    await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);
    await userEvent.click(button);

    await expect(saveDraft).toHaveBeenCalledTimes(1);
    const submitted = saveDraft.mock.calls[0]?.[0];
    await expect(submitted).toBeInstanceOf(FormData);
    await expect(Object.fromEntries(submitted ?? [])).toEqual({
      workspace: "Release review",
      email: "release.review@example.com",
      notes: "Keep the revised handoff checklist.",
    });
    await expect(button).toHaveFocus();
    await expect(button).not.toBeDisabled();
    await expect(
      within(button).getByRole("progressbar", { name: englishCopy.pendingLabel }),
    ).toBeVisible();
    await expect(canvas.queryByText(englishCopy.nameMissing)).not.toBeInTheDocument();
    await expect(canvas.queryByText(englishCopy.emailMissing)).not.toBeInTheDocument();
    await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);
    request.reject(new Error("Example save failed."));
    await expect(await canvas.findByRole("alert")).toHaveTextContent(englishCopy.failure);
    await expect(name).toHaveValue("Release review");
    await expect(email).toHaveValue("release.review@example.com");
    await expect(notes).toHaveValue("Keep the revised handoff checklist.");
    await expect(button).toHaveFocus();
    await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);
  },
};

export const SaveAndRetry: Story = {
  render: DraftForm,
  parameters: {
    docs: {
      description: {
        story:
          "The first local request fails, retry succeeds, and no request leaves the page. Pending Save keeps its text and focus without native disabling. The native draft controls become read-only, not unavailable; Enter from an input and native requestSubmit cannot duplicate an in-flight request. A service error sits before Save without moving focus, and retry takes a new FormData snapshot.",
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole<HTMLFormElement>("form", { name: englishCopy.formName });
    const name = canvas.getByRole<HTMLInputElement>("textbox", {
      name: `${englishCopy.nameLabel} (required)`,
    });
    const email = canvas.getByRole<HTMLInputElement>("textbox", {
      name: `${englishCopy.emailLabel} (required)`,
    });
    const notes = canvas.getByRole<HTMLTextAreaElement>("textbox", {
      name: `${englishCopy.notesLabel} (optional)`,
    });
    const button = canvas.getByRole("button", { name: englishCopy.saveLabel });
    const first = deferredRequest();
    const retry = deferredRequest();
    // Explicit completion keeps every pending assertion independent of the example delay.
    saveDraft.mockReturnValueOnce(first.promise).mockReturnValueOnce(retry.promise);

    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
    await expect(name).toBeValid();
    await expect(email).toBeValid();
    await userEvent.click(notes);
    await userEvent.type(notes, " Add the owner handoff.");
    const firstNotes = "Keep the handoff checklist. Add the owner handoff.";
    const initialTop = saveTop(form, button);
    const initialBounds = button.getBoundingClientRect();
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");

    await expect(saveDraft).toHaveBeenCalledTimes(1);
    const firstValues = saveDraft.mock.calls[0]?.[0];
    await expect(firstValues).toBeInstanceOf(FormData);
    await expect(Object.fromEntries(firstValues ?? [])).toEqual({
      workspace: englishCopy.defaultName,
      email: "review@example.com",
      notes: firstNotes,
    });
    await expect(button).toHaveFocus();
    await expect(button).toHaveTextContent(englishCopy.saveLabel);
    await expect(button).toHaveAttribute("aria-disabled", "true");
    await expect(button).not.toBeDisabled();
    await expect(
      within(button).getByRole("progressbar", { name: englishCopy.pendingLabel }),
    ).toBeVisible();
    await expect(canvas.getByRole("status")).toBeEmptyDOMElement();
    const pendingBounds = button.getBoundingClientRect();
    await expect([pendingBounds.width, pendingBounds.height]).toEqual([
      initialBounds.width,
      initialBounds.height,
    ]);
    await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);
    for (const control of [name, email, notes]) {
      await expect(control).toHaveAttribute("readonly");
      await expect(control).not.toBeDisabled();
    }

    await userEvent.click(button);
    await userEvent.keyboard("{Enter} ");
    await expect(saveDraft).toHaveBeenCalledTimes(1);
    await userEvent.click(name);
    await userEvent.keyboard("{Enter}");
    form.requestSubmit();
    await expect(saveDraft).toHaveBeenCalledTimes(1);
    await expect(name).toHaveFocus();
    await userEvent.click(notes);
    await userEvent.keyboard("{Control>}a{/Control}");
    await expect(notes.selectionStart).toBe(0);
    await expect(notes.selectionEnd).toBe(firstNotes.length);
    const copied = await userEvent.copy();
    await expect(copied?.getData("text/plain")).toBe(firstNotes);
    await userEvent.keyboard("This must not overwrite the pending draft.");
    await expect(notes).toHaveValue(firstNotes);
    await expect(notes).toHaveFocus();
    first.reject(new Error("Example save failed."));

    await expect(await canvas.findByRole("alert")).toHaveTextContent(englishCopy.failure);
    await expect(canvas.getAllByRole("alert")).toHaveLength(1);
    await expect(canvas.getByRole("status")).toBeEmptyDOMElement();
    await expect(notes).toHaveFocus();
    await expect(within(button).queryByRole("progressbar")).not.toBeInTheDocument();
    await expect(name).toHaveValue(englishCopy.defaultName);
    await expect(email).toHaveValue("review@example.com");
    await expect(notes).toHaveValue(firstNotes);
    await expect(notes).not.toHaveAttribute("readonly");
    await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);

    await userEvent.click(email);
    await userEvent.clear(email);
    await userEvent.type(email, "release.review@example.com");
    await userEvent.click(notes);
    await userEvent.keyboard("{End}");
    await userEvent.type(notes, " Add the release checklist.");
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(saveDraft).toHaveBeenCalledTimes(2);
    const retryValues = saveDraft.mock.calls[1]?.[0];
    await expect(retryValues).toBeInstanceOf(FormData);
    await expect(retryValues).not.toBe(firstValues);
    await expect(Object.fromEntries(retryValues ?? [])).toEqual({
      workspace: englishCopy.defaultName,
      email: "release.review@example.com",
      notes: `${firstNotes} Add the release checklist.`,
    });
    await expect(firstValues?.get("email")).toBe("review@example.com");
    await expect(firstValues?.get("notes")).toBe(firstNotes);
    await expect(button).toHaveFocus();
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
    retry.resolve();
    await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent(englishCopy.success));
    await expect(canvas.getAllByRole("status")).toHaveLength(1);
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
    await expect(button).toHaveFocus();
    await expect(email).toHaveValue("release.review@example.com");
    await expect(notes).toHaveValue(`${firstNotes} Add the release checklist.`);
    for (const control of [name, email, notes])
      await expect(control).not.toHaveAttribute("readonly");
    await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);
  },
};

export const ServerFieldErrors: Story = {
  render: (args) => (
    <DraftForm
      {...args}
      submit={saveWithFieldErrors}
      copy={{
        ...englishCopy,
        formName: "Server field recovery",
        intro:
          "Local server-response example: the first response returns two field errors; corrected retry succeeds. No request leaves this page. A real server must still validate and authorize the save.",
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Returned name-to-error mappings go through Form validationErrors, not custom isInvalid flags or a replacement validation system. React Aria clears each returned error when its value changes. Uncorrected errors still prevent native submission, and the next request reads the corrected controls.",
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole<HTMLFormElement>("form", { name: "Server field recovery" });
    const name = canvas.getByRole<HTMLInputElement>("textbox", {
      name: `${englishCopy.nameLabel} (required)`,
    });
    const email = canvas.getByRole<HTMLInputElement>("textbox", {
      name: `${englishCopy.emailLabel} (required)`,
    });
    const notes = canvas.getByRole<HTMLTextAreaElement>("textbox", {
      name: `${englishCopy.notesLabel} (optional)`,
    });
    const button = canvas.getByRole("button", { name: englishCopy.saveLabel });
    const nameDescriptionId = fieldDescription(name).id;
    const emailDescriptionId = fieldDescription(email).id;
    const initialTop = saveTop(form, button);
    const first = deferredRequest();
    const retry = deferredRequest();
    saveWithFieldErrors.mockReturnValueOnce(first.promise).mockReturnValueOnce(retry.promise);

    await expect(canvas.queryByText(serverErrors.workspace)).not.toBeInTheDocument();
    await expect(canvas.queryByText(serverErrors.email)).not.toBeInTheDocument();
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
    await userEvent.click(button);
    await expect(button).toHaveFocus();
    await expect(saveWithFieldErrors).toHaveBeenCalledTimes(1);
    await expect(Object.fromEntries(saveWithFieldErrors.mock.calls[0]?.[0] ?? [])).toEqual({
      workspace: englishCopy.defaultName,
      email: "review@example.com",
      notes: englishCopy.defaultNotes,
    });
    first.resolve(serverErrors);
    await expect(await canvas.findByText(serverErrors.workspace)).toBeVisible();
    await expect(await canvas.findByText(serverErrors.email)).toBeVisible();
    await expect(canvas.getByRole("alert")).toHaveTextContent(englishCopy.fieldFailure);
    await expect(canvas.getAllByRole("alert")).toHaveLength(1);
    await expectDescription(name, nameDescriptionId);
    await expectDescription(email, emailDescriptionId);
    await expect(notes).toHaveValue(englishCopy.defaultNotes);
    await expect(notes).toBeValid();
    await expect(button).toHaveFocus();
    await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);

    await userEvent.click(button);
    await waitFor(() => expect(name).toHaveFocus());
    await expect(saveWithFieldErrors).toHaveBeenCalledTimes(1);
    await userEvent.click(name);
    await userEvent.clear(name);
    await userEvent.type(name, "Delivery review");
    await userEvent.click(email);
    await waitFor(() => expect(canvas.queryByText(serverErrors.workspace)).not.toBeInTheDocument());
    await expect(canvas.getByText(serverErrors.email)).toBeVisible();
    await expectDescription(name, nameDescriptionId);
    await expectDescription(email, emailDescriptionId);
    await userEvent.clear(email);
    await userEvent.type(email, "delivery.review@example.com");
    await userEvent.click(notes);
    await waitFor(() => expect(canvas.queryByText(serverErrors.email)).not.toBeInTheDocument());
    await expectDescription(name, nameDescriptionId);
    await expectDescription(email, emailDescriptionId);
    await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);
    await userEvent.click(button);
    await expect(saveWithFieldErrors).toHaveBeenCalledTimes(2);
    await expect(Object.fromEntries(saveWithFieldErrors.mock.calls[1]?.[0] ?? [])).toEqual({
      workspace: "Delivery review",
      email: "delivery.review@example.com",
      notes: englishCopy.defaultNotes,
    });
    retry.resolve();
    await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent(englishCopy.success));
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
    await expect(button).toHaveFocus();
    await expect(name).toHaveValue("Delivery review");
    await expect(email).toHaveValue("delivery.review@example.com");
    await expect(notes).toHaveValue(englishCopy.defaultNotes);
    await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);
  },
};

export const LongRecovery: Story = {
  render: (args) => (
    <div className="form-story-narrow">
      <DraftForm
        {...args}
        empty
        recovery={longRecovery}
        copy={{
          ...englishCopy,
          intro:
            "Try Save with both required fields empty. These recovery messages deliberately exceed the narrow form's reserved budget: they must grow, not clip. The first local save fails; retry succeeds. No request leaves this page.",
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "An actually narrow container selects the larger 78px required-field recovery budget. Long messages are intentionally larger still; the form and Save position may grow to keep the complete recovery readable. No fixed height, line clamp, or blanket invalid treatment is added to optional fields.",
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole("form", { name: englishCopy.formName });
    const name = canvas.getByRole("textbox", { name: `${englishCopy.nameLabel} (required)` });
    const email = canvas.getByRole("textbox", { name: `${englishCopy.emailLabel} (required)` });
    const notes = canvas.getByRole("textbox", { name: `${englishCopy.notesLabel} (optional)` });
    const button = canvas.getByRole("button", { name: englishCopy.saveLabel });
    const nameDescriptionId = fieldDescription(name).id;
    const emailDescriptionId = fieldDescription(email).id;
    const initialTop = saveTop(form, button);
    await expect(canvas.queryByText(longRecovery.name)).not.toBeInTheDocument();
    await expect(canvas.queryByText(longRecovery.email)).not.toBeInTheDocument();
    await userEvent.click(button);
    await waitFor(() => expect(name).toHaveFocus());
    for (const message of [longRecovery.name, longRecovery.email]) {
      const error = await canvas.findByText(message);
      const help = error.parentElement!;
      await expect(error).toBeVisible();
      await expect(error.textContent).toBe(message);
      await expect(error.getBoundingClientRect().height).toBeGreaterThan(
        parseFloat(getComputedStyle(help).minBlockSize),
      );
      await expect(error.scrollHeight).toBeLessThanOrEqual(error.clientHeight + 1);
      await expect(error.scrollWidth).toBeLessThanOrEqual(error.clientWidth + 1);
    }
    await expectDescription(name, nameDescriptionId);
    await expectDescription(email, emailDescriptionId);
    await expect(notes).not.toBeRequired();
    await expect(notes).toBeValid();
    await expect(saveTop(form, button)).toBeGreaterThan(initialTop);
    await expect(saveDraft).not.toHaveBeenCalled();
  },
};

function RightToLeftExample(args: FormProps) {
  const { theme } = useTheme();
  return (
    <div className="form-story-locales">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <DraftForm {...args} copy={persianCopy} empty />
      </Theme>
      <Theme theme={theme} lang="ar" dir="rtl">
        <DraftForm {...args} copy={arabicCopy} empty />
      </Theme>
    </div>
  );
}

export const RightToLeft: Story = {
  render: RightToLeftExample,
  parameters: {
    docs: {
      description: {
        story:
          "Persian and Arabic use real Theme locale providers, Hashti's localized necessity wording, authored recovery/pending text, native required inputs, and isolated Latin email values and identifiers. Both local forms retain drafts through failure and retry without focus changes or duplicate live feedback. Browser-generated validation wording is not assumed to follow the Theme locale.",
      },
    },
  },
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
      const notes = scope.getByRole<HTMLTextAreaElement>("textbox", {
        name: `${copy.notesLabel} (${optional})`,
      });
      const button = scope.getByRole("button", { name: copy.saveLabel });
      const nameDescriptionId = fieldDescription(name).id;
      const emailDescriptionId = fieldDescription(email).id;
      const initialTop = saveTop(form, button);
      const callIndex = saveDraft.mock.calls.length;
      const first = deferredRequest();
      const retry = deferredRequest();
      saveDraft.mockReturnValueOnce(first.promise).mockReturnValueOnce(retry.promise);

      await expect(localeRoot).toHaveAttribute("lang", locale);
      await expect(localeRoot).toHaveAttribute("dir", "rtl");
      await expect(getComputedStyle(name).direction).toBe("rtl");
      await expect(getComputedStyle(email).direction).toBe("ltr");
      await expect(getComputedStyle(email).unicodeBidi).toBe("isolate");
      await expect(scope.getByText("WS-1042")).toHaveAttribute("dir", "ltr");
      await expect(scope.getByText("WS-1042").tagName).toBe("BDI");
      await expect(name).toBeRequired();
      await expect(email).toBeRequired();
      await expect(scope.queryByText(copy.nameMissing)).not.toBeInTheDocument();
      await expect(scope.queryByText(copy.emailMissing)).not.toBeInTheDocument();
      await expect(scope.queryByRole("alert")).not.toBeInTheDocument();
      await userEvent.click(button);
      await waitFor(() => expect(name).toHaveFocus());
      await expect(await scope.findByText(copy.nameMissing)).toBeVisible();
      await expect(await scope.findByText(copy.emailMissing)).toBeVisible();
      await expectDescription(name, nameDescriptionId);
      await expectDescription(email, emailDescriptionId);
      await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);

      await userEvent.click(name);
      await userEvent.type(name, copy.defaultName);
      await userEvent.click(email);
      await userEvent.type(email, contact);
      await userEvent.click(notes);
      await expectDescription(name, nameDescriptionId);
      await expectDescription(email, emailDescriptionId);
      await userEvent.click(button);
      await expect(saveDraft).toHaveBeenCalledTimes(callIndex + 1);
      await expect(Object.fromEntries(saveDraft.mock.calls[callIndex]?.[0] ?? [])).toEqual({
        workspace: copy.defaultName,
        email: contact,
        notes: copy.defaultNotes,
      });
      await expect(button).toHaveFocus();
      await expect(button).not.toBeDisabled();
      await expect(button).toHaveTextContent(copy.saveLabel);
      await expect(
        within(button).getByRole("progressbar", { name: copy.pendingLabel }),
      ).toBeVisible();
      await expect(scope.getByRole("status")).toBeEmptyDOMElement();
      await userEvent.click(button);
      await userEvent.keyboard("{Enter} ");
      await userEvent.click(email);
      await userEvent.keyboard("{Enter}");
      await expect(saveDraft).toHaveBeenCalledTimes(callIndex + 1);
      await userEvent.click(notes);
      await expect(notes).toHaveAttribute("readonly");
      await expect(notes).not.toBeDisabled();
      await userEvent.tab();
      await expect(button).toHaveFocus();
      first.reject(new Error("Example save failed."));
      await expect(await scope.findByRole("alert")).toHaveTextContent(copy.failure);
      await expect(scope.getAllByRole("alert")).toHaveLength(1);
      await expect(button).toHaveFocus();
      await expect(name).toHaveValue(copy.defaultName);
      await expect(email).toHaveValue(contact);
      await expect(notes).toHaveValue(copy.defaultNotes);
      await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);
      await userEvent.keyboard("{Enter}");
      await expect(saveDraft).toHaveBeenCalledTimes(callIndex + 2);
      await expect(Object.fromEntries(saveDraft.mock.calls[callIndex + 1]?.[0] ?? [])).toEqual({
        workspace: copy.defaultName,
        email: contact,
        notes: copy.defaultNotes,
      });
      retry.resolve();
      await waitFor(() => expect(scope.getByRole("status")).toHaveTextContent(copy.success));
      await expect(scope.getAllByRole("status")).toHaveLength(1);
      await expect(scope.queryByRole("alert")).not.toBeInTheDocument();
      await expect(button).toHaveFocus();
      await expect(name).toHaveValue(copy.defaultName);
      await expect(email).toHaveValue(contact);
      await expect(notes).toHaveValue(copy.defaultNotes);
      await expectDescription(name, nameDescriptionId);
      await expectDescription(email, emailDescriptionId);
      await expect(Math.abs(saveTop(form, button) - initialTop)).toBeLessThan(1);
    }
  },
};
