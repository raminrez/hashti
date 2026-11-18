import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Button, Icon, Link, Theme, useTheme, type LinkProps } from "@hashti/react";
import "./actions.css";

const meta = {
  title: "Actions/Link",
  component: Link,
  args: {
    children: "Publishing guidelines",
    href: "#link-guidelines",
    onClick: fn(),
  },
  argTypes: {
    children: { control: "text" },
    href: { control: "text" },
    inline: { control: "boolean" },
    disabled: { control: "boolean" },
    target: { control: "select", options: [undefined, "_self", "_blank"] },
    "aria-label": { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Use Link for destinations and Button for actions. Link is a ui-sdk Button rendered as an anchor, so it keeps its href, its link semantics, and it cannot navigate while disabled. A disabled or href-less link renders a span with link semantics. inline adds a persistent underline within prose.",
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

function Destination({ href }: Pick<LinkProps, "href">) {
  if (!href?.startsWith("#")) return null;
  return (
    <p id={href.slice(1)} tabIndex={-1} className="action-story-prose">
      Before publishing, check the draft title, access, and sharing settings.
    </p>
  );
}

export const Playground: Story = {
  render: (args) => (
    <div className="action-story-stack">
      <Link {...args} />
      <Destination href={args.href} />
    </div>
  ),
};

export const Inline: Story = {
  args: { inline: true, href: "#inline-guidelines", children: "publishing guidelines" },
  render: (args) => (
    <div className="action-story-stack">
      <p className="action-story-prose">
        Read the <Link {...args} /> before sharing a draft with your workspace.
      </p>
      <Destination href={args.href} />
    </div>
  ),
};

export const Navigation: Story = {
  args: { href: "#navigation-guidelines", onClick: fn() },
  render: Playground.render,
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Publishing guidelines" });
    const view = canvasElement.ownerDocument.defaultView!;
    await expect(link.tagName).toBe("A");
    await expect(link).toHaveAttribute("href", "#navigation-guidelines");
    await userEvent.click(link);
    await expect(view.location.hash).toBe("#navigation-guidelines");
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    view.history.replaceState(null, "", view.location.pathname + view.location.search);
    await expect(view.location.hash).toBe("");
    await userEvent.tab({ shift: true });
    await expect(link).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(view.location.hash).toBe("#navigation-guidelines");
  },
};

export const Disabled: Story = {
  args: { href: "#billing-settings", children: "Billing settings", disabled: true },
  render: (args) => (
    <div className="action-story-stack">
      <p>Billing settings require workspace owner access.</p>
      <Link {...args} />
      <Link href="#billing-help">Read access guidelines</Link>
      <Destination href="#billing-help" />
    </div>
  ),
  parameters: { controls: { exclude: ["disabled"] } },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Billing settings" });
    await expect(link.tagName).toBe("SPAN");
    await expect(link).toHaveAttribute("data-disabled");
    await userEvent.click(link);
    await expect(args.onClick).not.toHaveBeenCalled();
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Read access guidelines" })).toHaveFocus();
  },
};

export const External: Story = {
  args: {
    href: "https://ui-sdk.dev/docs",
    target: "_blank",
    rel: "noreferrer",
    children: (
      <>
        ui-sdk docs (opens in a new tab) <Icon name="external" />
      </>
    ),
  },
  parameters: { controls: { exclude: ["children"] } },
};

export const Customization: Story = {
  args: { href: "#custom-guidelines", inline: true, children: "Publishing guidelines" },
  render: (args) => (
    <div className="action-story-stack">
      <Link {...args} className="action-story-custom-link" />
      <Destination href={args.href} />
    </div>
  ),
  parameters: { controls: { exclude: ["children"] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Publishing guidelines" });
    await expect(link).toHaveClass("hashti-link", "action-story-custom-link");
    await expect(link).toHaveAccessibleName("Publishing guidelines");
  },
};

export const LongLabel: Story = {
  args: { inline: true, href: "#long-guidelines" },
  render: (args) => (
    <div className="action-story-stack action-story-narrow">
      <p className="action-story-prose">
        Read <Link {...args}>workspacepublishingandnotificationpreferences</Link> before changing
        how the team receives updates.
      </p>
      <Destination href={args.href} />
    </div>
  ),
  parameters: { controls: { exclude: ["children"] } },
};

function RightToLeftExample(args: LinkProps) {
  const { theme } = useTheme();
  return (
    <div className="action-story-stack action-story-narrow">
      <Theme theme={theme} lang="fa-IR" dir="rtl" className="action-story-stack">
        <p>
          فارسی · فضای کاری <bdi dir="ltr">WS-1042</bdi>
        </p>
        <Link {...args} href="#rtl-guidelines-fa">
          راهنمای انتشار و اشتراک‌گذاری در فضای کاری <Icon name="chevronLeft" />
        </Link>
        <p id="rtl-guidelines-fa" tabIndex={-1}>
          پیش از انتشار، تنظیمات اشتراک‌گذاری را بررسی کنید.
        </p>
      </Theme>
      <Theme theme={theme} lang="ar" dir="rtl" className="action-story-stack">
        <p>
          العربية · مساحة العمل <bdi dir="ltr">WS-1042</bdi>
        </p>
        <Link {...args} href="#rtl-guidelines-ar">
          إرشادات النشر والمشاركة في مساحة العمل <Icon name="chevronLeft" />
        </Link>
        <p id="rtl-guidelines-ar" tabIndex={-1}>
          راجع إعدادات المشاركة قبل النشر.
        </p>
      </Theme>
    </div>
  );
}

export const RightToLeft: Story = {
  args: { inline: true },
  render: RightToLeftExample,
  parameters: { controls: { exclude: ["children", "href"] } },
};

export const FocusGuidelines: Story = {
  args: { href: "#focus-guidelines", children: "Publishing guidelines" },
  render: (args) => (
    <div className="action-story-stack">
      <Link {...args} />
      <Button
        variant="ghost"
        onClick={() =>
          document.querySelector<HTMLAnchorElement>(".hashti-link")?.focus()
        }
      >
        Focus guidelines link
      </Button>
      <Destination href={args.href} />
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Publishing guidelines" });
    await userEvent.click(canvas.getByRole("button", { name: "Focus guidelines link" }));
    await expect(link).toHaveFocus();
    await expect(link).toHaveClass("hashti-link");
  },
};
