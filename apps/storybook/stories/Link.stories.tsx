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
    onPress: fn(),
  },
  argTypes: {
    children: { control: "text" },
    href: { control: "text" },
    inline: { control: "boolean" },
    isDisabled: { control: "boolean" },
    target: { control: "select", options: [undefined, "_self", "_blank"] },
    "aria-label": { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Use Link for destinations and Button for actions. An enabled href renders a native anchor. Disabled or href-less links render RAC's span with link semantics. inline adds a persistent underline within prose; it does not change navigation.",
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
  args: { href: "#navigation-guidelines", onPress: fn() },
  render: Playground.render,
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Publishing guidelines" });
    const destination = canvas.getByText(
      "Before publishing, check the draft title, access, and sharing settings.",
    );
    const view = canvasElement.ownerDocument.defaultView!;
    await expect(link.tagName).toBe("A");
    await expect(link).toHaveAttribute("href", "#navigation-guidelines");
    await userEvent.click(link);
    await expect(view.location.hash).toBe("#navigation-guidelines");
    await expect(destination).toHaveFocus();
    await expect(args.onPress).toHaveBeenCalledTimes(1);
    await userEvent.tab({ shift: true });
    await expect(link).toHaveFocus();
    await expect(link).toHaveAttribute("data-focus-visible");
    view.history.replaceState(null, "", view.location.pathname + view.location.search);
    await expect(view.location.hash).toBe("");
    await userEvent.keyboard("{Enter}");
    // Native fragment navigation focuses the destination before RAC's keyup callback.
    await expect(view.location.hash).toBe("#navigation-guidelines");
    await expect(destination).toHaveFocus();
  },
};

export const Disabled: Story = {
  args: { href: "#billing-settings", children: "Billing settings", isDisabled: true },
  render: (args) => (
    <div className="action-story-stack">
      <p>Billing settings require workspace owner access.</p>
      <Link {...args} />
      <Link href="#billing-help">Read access guidelines</Link>
      <Destination href="#billing-help" />
    </div>
  ),
  parameters: { controls: { exclude: ["isDisabled"] } },
  play: async ({ canvasElement, args, userEvent }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Billing settings" });
    await expect(link.tagName).toBe("SPAN");
    await expect(link).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(link);
    await expect(args.onPress).not.toHaveBeenCalled();
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Read access guidelines" })).toHaveFocus();
  },
};

export const KeyboardAndPointer: Story = {
  args: { href: "#interaction-guidelines", onPress: fn() },
  render: Playground.render,
  play: async ({ canvasElement, args, userEvent }) => {
    const link = within(canvasElement).getByRole("link", { name: "Publishing guidelines" });
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await expect(link).toHaveAttribute("data-focus-visible");
    await userEvent.keyboard(" ");
    await expect(args.onPress).not.toHaveBeenCalled();
    await userEvent.hover(link);
    await expect(link).toHaveAttribute("data-hovered");
    await userEvent.pointer({ target: link, keys: "[MouseLeft>]" });
    await expect(link).toHaveAttribute("data-pressed");
    await expect(args.onPress).not.toHaveBeenCalled();
    await userEvent.pointer({ target: link, keys: "[/MouseLeft]" });
    await expect(link).not.toHaveAttribute("data-pressed");
    await expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};

export const External: Story = {
  args: {
    href: "https://react-aria.adobe.com/Link",
    target: "_blank",
    rel: "noreferrer",
    children: (
      <>
        React Aria Link reference (opens in a new tab) <Icon name="external" />
      </>
    ),
  },
  parameters: { controls: { exclude: ["children"] } },
};

function CustomLink(args: LinkProps) {
  return (
    <div className="action-story-stack">
      <Link
        {...args}
        className={({ isPressed }) =>
          `action-story-custom-link${isPressed ? " action-story-custom-link--pressed" : ""}`
        }
        style={({ isHovered, defaultStyle }) => ({
          ...defaultStyle,
          textUnderlineOffset: isHovered ? "0.3em" : "0.2em",
        })}
        render={(domProps, { isDisabled }) =>
          args.href && !isDisabled && "href" in domProps ? (
            <a {...domProps} data-custom-render="true">
              {domProps.children}
            </a>
          ) : (
            <span {...domProps} data-custom-render="true" />
          )
        }
      >
        {({ isPressed }) => (
          <>
            Publishing guidelines <Icon name={isPressed ? "check" : "arrowRight"} />
          </>
        )}
      </Link>
      {/* No JSX ref: Storybook's source serializer reads element.ref, which React 19 deprecates. */}
      <Button
        variant="ghost"
        onPress={() => document.querySelector<HTMLAnchorElement>("[data-custom-render]")?.focus()}
      >
        Focus guidelines link
      </Button>
      <Destination href={args.href} />
    </div>
  );
}

export const Customization: Story = {
  args: { href: "#custom-guidelines", inline: true },
  render: CustomLink,
  parameters: { controls: { exclude: ["children"] } },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Publishing guidelines" });
    await userEvent.click(canvas.getByRole("button", { name: "Focus guidelines link" }));
    await expect(link).toHaveFocus();
    await expect(link).toHaveClass("hashti-link", "action-story-custom-link");
    await expect(link).toHaveAttribute("data-custom-render", "true");
    await userEvent.hover(link);
    await expect(link).toHaveAttribute("data-hovered");
    await expect(link.style.textUnderlineOffset).toBe("0.3em");
    const hoveredStyle = getComputedStyle(link);
    await expect(parseFloat(hoveredStyle.textUnderlineOffset)).toBeCloseTo(
      0.3 * parseFloat(hoveredStyle.fontSize),
    );
    await userEvent.pointer({ target: link, keys: "[MouseLeft>]" });
    await expect(link).toHaveClass("action-story-custom-link--pressed");
    await expect(link).toHaveAccessibleName("Publishing guidelines");
    await userEvent.pointer({ target: link, keys: "[/MouseLeft]" });
    await expect(link).not.toHaveAttribute("data-pressed");
    await expect(link).not.toHaveClass("action-story-custom-link--pressed");
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
      <Theme theme={theme} locale="fa-IR" className="action-story-stack">
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
      <Theme theme={theme} locale="ar" className="action-story-stack">
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
