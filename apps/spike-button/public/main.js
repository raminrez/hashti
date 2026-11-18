var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  if (mod && typeof mod === "object" || typeof mod === "function") {
    for (let key of __getOwnPropNames(mod))
      if (!__hasOwnProp.call(to, key))
        __defProp(to, key, {
          get: __accessProp.bind(mod, key),
          enumerable: true
        });
  }
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __esm = (fn, res, err) => () => {
  if (fn)
    try {
      res = fn(fn = 0);
    } catch (e) {
      err = [e];
    }
  if (err)
    throw err[0];
  return res;
};

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/platform/announce.js
function regionIn(doc, priority) {
  let found = regions.get(doc);
  if (!found) {
    regions.set(doc, found = {});
  }
  const existing = found[priority];
  if (existing?.isConnected) {
    return existing;
  }
  const region = doc.createElement("div");
  region.setAttribute("role", priority === "assertive" ? "alert" : "status");
  region.setAttribute("aria-live", priority);
  region.setAttribute("aria-atomic", "true");
  region.setAttribute("data-ui-sdk-announcer", priority === "assertive" ? "assertive" : "");
  region.style.cssText = "position:fixed;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap";
  doc.body.append(region);
  found[priority] = region;
  return region;
}
function announce(text, {
  priority = "polite",
  doc = typeof document === "undefined" ? undefined : document
} = {}) {
  if (!text) {
    return;
  }
  if (announcer) {
    return announcer(text, priority);
  }
  if (!doc?.body) {
    return;
  }
  const region = regionIn(doc, priority);
  region.textContent = "";
  clearTimeout(pending[priority]);
  pending[priority] = setTimeout(() => {
    region.textContent = text;
  }, 100);
}
var regions, announcer, pending;
var init_announce = __esm(() => {
  regions = /* @__PURE__ */ new WeakMap;
  pending = {};
});

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/platform/style.js
function pageNonce(doc) {
  if (nonces.has(doc)) {
    return nonces.get(doc);
  }
  let meta;
  for (let at = doc;at && !meta; at = at.defaultView?.frameElement?.ownerDocument) {
    meta = at.head?.querySelector('meta[property="csp-nonce"]');
  }
  const nonce = meta ? meta.nonce || meta.getAttribute("nonce") || "" : null;
  nonces.set(doc, nonce);
  return nonce;
}
function writeStyle(doc, id, css) {
  if (!doc.head) {
    return;
  }
  const view = doc.defaultView;
  if (pageNonce(doc) === "" && view && "adoptedStyleSheets" in doc) {
    adoptStyle(doc, view, id, css);
  } else {
    appendStyle(doc, id, css);
  }
}
function appendStyle(doc, id, css) {
  const existing = doc.getElementById(id);
  if (existing) {
    if (styleText.get(existing) === css) {
      return;
    }
    if (existing.textContent !== css) {
      existing.textContent = css;
    }
    styleText.set(existing, css);
    return;
  }
  const style = doc.createElement("style");
  style.id = id;
  const nonce = pageNonce(doc);
  if (nonce) {
    style.nonce = nonce;
  }
  style.textContent = css;
  styleText.set(style, css);
  const ours = doc.head.querySelectorAll(':scope > style[id^="ui-sdk-"]');
  if (ours.length) {
    ours[ours.length - 1].after(style);
  } else {
    doc.head.prepend(style);
  }
}
function adoptStyle(doc, view, id, css) {
  let sheets = adopted().get(doc);
  if (!sheets) {
    adopted().set(doc, sheets = /* @__PURE__ */ new Map);
  }
  let entry = sheets.get(id);
  if (!entry) {
    sheets.set(id, entry = { sheet: new view.CSSStyleSheet, css: "" });
  }
  if (entry.css !== css) {
    entry.sheet.replaceSync(css);
    entry.css = css;
  }
  if (!doc.adoptedStyleSheets.includes(entry.sheet)) {
    doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, entry.sheet];
  }
}
function enforceHidden(doc) {
  writeStyle(doc, "ui-sdk-hidden", '@layer ui-sdk { :where([data-slot][hidden]:not([hidden="until-found"])) { display: none !important } }');
}
var adopted = () => globalThis[/* @__PURE__ */ Symbol.for("ui-sdk.styles@1")] ??= /* @__PURE__ */ new WeakMap, nonces, styleText;
var init_style = __esm(() => {
  nonces = /* @__PURE__ */ new WeakMap;
  styleText = /* @__PURE__ */ new WeakMap;
});

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/events.js
function on(target, type, listener, options) {
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}
function isComposing(event) {
  const key = "nativeEvent" in event ? event.nativeEvent : event;
  return key.isComposing === true || key.keyCode === 229;
}
var init_events = () => {};

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/platform/env.js
var isBrowser;
var init_env = __esm(() => {
  isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
});

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/order.js
var following = 4;
var isAfter = (node, later) => !!(node.compareDocumentPosition(later) & following);
var documentOrder = (a, b) => isAfter(a, b) ? -1 : 1;
var walkFrom = 16;
var walkPerEntry = 32;
function inDocumentOrder(entries) {
  let container = entries.length < walkFrom ? null : entries[0].el.parentNode;
  while (container && !entries.every(({ el }) => container.contains(el))) {
    container = container.parentNode;
  }
  if (container) {
    const byElement = new Map(entries.map((entry) => [entry.el, entry]));
    const sorted = [];
    const walker = entries[0].el.ownerDocument.createTreeWalker(container, 1);
    let budget = entries.length * walkPerEntry;
    for (let node = container;node && budget--; node = walker.nextNode()) {
      const entry = byElement.get(node);
      if (entry && sorted.push(entry) === entries.length) {
        return sorted;
      }
    }
  }
  return entries.sort((a, b) => documentOrder(a.el, b.el));
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/trusted.js
var trusted = (event) => event.isTrusted;

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/forms/value.js
var scriptWrites = /* @__PURE__ */ new Set;
function writeFromScript(el, write) {
  if (scriptWrites.has(el)) {
    return write();
  }
  scriptWrites.add(el);
  try {
    write();
  } finally {
    scriptWrites.delete(el);
  }
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/forms/form.js
var internalsOf = /* @__PURE__ */ new WeakMap;
var focusOf = /* @__PURE__ */ new WeakMap;
function focusWith(el, focus) {
  focusOf.set(el, focus);
  return () => {
    if (focusOf.get(el) === focus) {
      focusOf.delete(el);
    }
  };
}
function focusControl(el) {
  const focus = focusOf.get(el);
  if (focus) {
    focus();
  } else {
    el.focus();
  }
}
var focusing = /* @__PURE__ */ new WeakSet;
function claimInvalidFocus(el, form) {
  const owner = form ?? el.ownerDocument;
  if (focusing.has(owner)) {
    return;
  }
  focusing.add(owner);
  setTimeout(() => focusing.delete(owner));
  focusControl(el);
}
function attachFormInternals(el, internals, bind) {
  internalsOf.set(el, { internals, bind });
}
var validityListeners = /* @__PURE__ */ new Set;
function validityChanged(el) {
  validityListeners.forEach((listener) => listener(el));
}
function fieldsetDisabled(el) {
  for (let node = el.parentElement;node; node = node.parentElement) {
    if (!(node instanceof HTMLFieldSetElement) || !node.disabled) {
      continue;
    }
    const legend = node.querySelector(":scope > legend");
    if (!legend?.contains(el)) {
      return true;
    }
  }
  return false;
}
var moves = /* @__PURE__ */ new WeakMap;
function watchFieldsets(el, onChange) {
  let disabled;
  let observer;
  let active = true;
  const check = () => {
    if (observer) {
      observer.disconnect();
      for (let node = el.parentElement;node?.closest("fieldset"); node = node.parentElement) {
        observer.observe(node, {
          childList: true,
          attributeFilter: ["disabled"]
        });
      }
    }
    const now = fieldsetDisabled(el);
    if (now !== disabled) {
      onChange(disabled = now);
    }
  };
  const watch = () => {
    if (!active) {
      return;
    }
    if (typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(check);
    }
    check();
    moves.set(el, check);
  };
  if (el.isConnected) {
    watch();
  } else {
    queueMicrotask(watch);
  }
  return () => {
    active = false;
    observer?.disconnect();
    moves.delete(el);
  };
}
var elementMoved = (el) => moves.get(el)?.();
var isDisabled = (state) => state.disabled || state.formDisabled;
var watchFormDisabled = (el, store) => watchFieldsets(el, (formDisabled) => store.set({ formDisabled }));
var labelCount = 0;
function labelsOf(el) {
  const labels = [];
  const around = el.closest("label");
  if (around?.control === el) {
    labels.push(around);
  }
  if (el.id) {
    const root = el.getRootNode();
    root.querySelectorAll(`label[for="${CSS.escape(el.id)}"]`).forEach((label) => {
      if (label !== around && label.control === el) {
        labels.push(label);
      }
    });
  }
  return labels.sort(documentOrder);
}
function labelledBy(el, findLabels, watch = el) {
  let written;
  const update = () => {
    const current = el.getAttribute("aria-labelledby");
    if (el.hasAttribute("aria-label") || current !== null && current !== written) {
      return;
    }
    const labels = findLabels();
    for (const label of labels) {
      if (!label.id) {
        label.id = `ui-sdk-label-${++labelCount}`;
      }
    }
    const ids = labels.map((label) => label.id).join(" ");
    if (!ids) {
      if (written !== undefined) {
        el.removeAttribute("aria-labelledby");
      }
      written = undefined;
      return;
    }
    written = ids;
    if (current !== ids) {
      el.setAttribute("aria-labelledby", ids);
    }
  };
  queueMicrotask(update);
  watch.addEventListener("focusin", update);
  return () => watch.removeEventListener("focusin", update);
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/option-names.js
var capitalized = (key) => `${key[0].toUpperCase()}${key.slice(1)}`;
var defaultName = (key) => `default${capitalized(key)}`;

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/roles.js
var roles = [
  "alert",
  "alertdialog",
  "application",
  "article",
  "banner",
  "blockquote",
  "button",
  "caption",
  "cell",
  "checkbox",
  "code",
  "columnheader",
  "combobox",
  "complementary",
  "contentinfo",
  "definition",
  "deletion",
  "dialog",
  "document",
  "emphasis",
  "feed",
  "figure",
  "form",
  "generic",
  "grid",
  "gridcell",
  "group",
  "heading",
  "img",
  "insertion",
  "link",
  "list",
  "listbox",
  "listitem",
  "log",
  "main",
  "marquee",
  "math",
  "menu",
  "menubar",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "meter",
  "navigation",
  "none",
  "note",
  "option",
  "paragraph",
  "presentation",
  "progressbar",
  "radio",
  "radiogroup",
  "region",
  "row",
  "rowgroup",
  "rowheader",
  "scrollbar",
  "search",
  "searchbox",
  "separator",
  "slider",
  "spinbutton",
  "status",
  "strong",
  "subscript",
  "superscript",
  "switch",
  "tab",
  "table",
  "tablist",
  "tabpanel",
  "term",
  "textbox",
  "time",
  "timer",
  "toolbar",
  "tooltip",
  "tree",
  "treegrid",
  "treeitem"
];
var focusableRoles = [
  "button",
  "checkbox",
  "combobox",
  "gridcell",
  "link",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "radio",
  "searchbox",
  "slider",
  "spinbutton",
  "switch",
  "tab",
  "textbox",
  "treeitem"
];
var pressableRoles = [
  "button",
  "checkbox",
  "link",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "radio",
  "switch",
  "tab",
  "treeitem"
];
var keyedRoles = [
  "combobox",
  "grid",
  "listbox",
  "menu",
  "menubar",
  "radiogroup",
  "slider",
  "spinbutton",
  "tablist",
  "toolbar",
  "tree",
  "treegrid"
];
var ariaSupport = {
  "aria-activedescendant": [
    "application",
    "combobox",
    "grid",
    "group",
    "listbox",
    "menu",
    "menubar",
    "radiogroup",
    "row",
    "searchbox",
    "spinbutton",
    "tablist",
    "textbox",
    "toolbar",
    "tree",
    "treegrid"
  ],
  "aria-autocomplete": ["combobox", "searchbox", "textbox"],
  "aria-checked": [
    "checkbox",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "switch",
    "treeitem"
  ],
  "aria-colcount": ["grid", "table", "treegrid"],
  "aria-colindex": ["cell", "columnheader", "gridcell", "row", "rowheader"],
  "aria-colspan": ["cell", "columnheader", "gridcell", "rowheader"],
  "aria-expanded": [
    "application",
    "button",
    "checkbox",
    "columnheader",
    "combobox",
    "gridcell",
    "link",
    "listbox",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "row",
    "rowheader",
    "switch",
    "tab",
    "treeitem"
  ],
  "aria-level": ["heading", "listitem", "row", "treeitem"],
  "aria-modal": ["alertdialog", "dialog"],
  "aria-multiline": ["searchbox", "textbox"],
  "aria-multiselectable": ["grid", "listbox", "tablist", "tree", "treegrid"],
  "aria-orientation": [
    "listbox",
    "menu",
    "menubar",
    "radiogroup",
    "scrollbar",
    "separator",
    "slider",
    "tablist",
    "toolbar",
    "tree",
    "treegrid"
  ],
  "aria-placeholder": ["searchbox", "textbox"],
  "aria-posinset": [
    "article",
    "listitem",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "row",
    "tab",
    "treeitem"
  ],
  "aria-pressed": ["button"],
  "aria-readonly": [
    "checkbox",
    "columnheader",
    "combobox",
    "grid",
    "gridcell",
    "listbox",
    "menuitemcheckbox",
    "menuitemradio",
    "radiogroup",
    "rowheader",
    "searchbox",
    "slider",
    "spinbutton",
    "switch",
    "textbox"
  ],
  "aria-required": [
    "checkbox",
    "columnheader",
    "combobox",
    "gridcell",
    "listbox",
    "radiogroup",
    "rowheader",
    "searchbox",
    "spinbutton",
    "switch",
    "textbox",
    "tree",
    "treegrid"
  ],
  "aria-rowcount": ["grid", "table", "treegrid"],
  "aria-rowindex": ["cell", "columnheader", "gridcell", "row", "rowheader"],
  "aria-rowspan": ["cell", "columnheader", "gridcell", "rowheader"],
  "aria-selected": [
    "columnheader",
    "gridcell",
    "option",
    "row",
    "rowheader",
    "tab",
    "treeitem"
  ],
  "aria-setsize": [
    "article",
    "listitem",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "row",
    "tab",
    "treeitem"
  ],
  "aria-sort": ["columnheader", "rowheader"],
  "aria-valuemax": [
    "meter",
    "progressbar",
    "scrollbar",
    "separator",
    "slider",
    "spinbutton"
  ],
  "aria-valuemin": [
    "meter",
    "progressbar",
    "scrollbar",
    "separator",
    "slider",
    "spinbutton"
  ],
  "aria-valuenow": [
    "meter",
    "progressbar",
    "scrollbar",
    "separator",
    "slider",
    "spinbutton"
  ],
  "aria-valuetext": [
    "meter",
    "progressbar",
    "scrollbar",
    "separator",
    "slider",
    "spinbutton"
  ]
};
var namelessRoles = [
  "caption",
  "code",
  "deletion",
  "emphasis",
  "generic",
  "insertion",
  "none",
  "paragraph",
  "presentation",
  "strong",
  "subscript",
  "superscript"
];
var requiredStates = {
  checkbox: ["aria-checked"],
  combobox: ["aria-expanded"],
  menuitemcheckbox: ["aria-checked"],
  menuitemradio: ["aria-checked"],
  meter: ["aria-valuenow"],
  option: ["aria-selected"],
  radio: ["aria-checked"],
  slider: ["aria-valuenow"],
  switch: ["aria-checked"],
  tab: ["aria-selected"]
};
var focusable = new Set(focusableRoles);
var pressable = new Set(pressableRoles);
var keyed = new Set(keyedRoles);
function unmetNeeds(role, slot) {
  const unmet = [];
  if (focusable.has(role) && !slot.focus) {
    unmet.push("focus");
  }
  if (pressable.has(role) && !slot.press) {
    unmet.push("press");
  }
  if (keyed.has(role) && !slot.keys) {
    unmet.push("keys");
  }
  if ((Array.isArray(slot.keys) || typeof slot.keys === "function") && !slot.on?.keydown) {
    unmet.push("keydown");
  }
  return unmet;
}
var knownRoles = new Set(roles);
var naming = ["aria-label", "aria-labelledby"];
var nativeStates = {
  checkbox: ["aria-checked"],
  number: ["aria-valuenow"],
  radio: ["aria-checked"],
  range: ["aria-valuenow"]
};
function ariaProblems(role, attrs) {
  const notAllowed = [];
  for (const [name, value] of Object.entries(attrs)) {
    if (value === undefined) {
      continue;
    }
    const supported = ariaSupport[name];
    if (supported && !supported.includes(role)) {
      notAllowed.push(name);
    }
    if (naming.includes(name) && namelessRoles.includes(role)) {
      notAllowed.push(name);
    }
  }
  const required = requiredStates[role] ?? [];
  const native = nativeStates[attrs.type] ?? [];
  return {
    notAllowed,
    missing: required.filter((name) => attrs[name] === undefined && !native.includes(name))
  };
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/dev.js
var dev = true;
var hookKey = /* @__PURE__ */ Symbol.for("ui-sdk.devtools@1");
var historyKey = /* @__PURE__ */ Symbol.for("ui-sdk.devtools.history@1");
var limit = 500;
var history = globalThis[historyKey] ??= {
  changes: [],
  warnings: [],
  layers: [],
  relays: [],
  shortcuts: undefined
};
function keep(list, item) {
  list.push(item);
  if (list.length > limit) {
    list.splice(0, list.length - limit);
  }
}
function emit(event) {
  if (!installed) {
    install();
  }
  if (event.type === "change") {
    keep(history.changes, event);
  } else if (event.type === "warn") {
    keep(history.warnings, event);
  } else if (event.type === "relay") {
    keep(history.relays ??= [], event);
  } else if (event.type === "layers") {
    history.layers = event.stack;
  }
  const hook = globalThis[hookKey];
  hook?.emit?.(event);
}
function warn(message, from, detail) {
  say(message, from, detail, true);
}
function note(message, from, detail) {
  say(message, from, detail, false);
}
function say(message, from, detail, strict) {
  const flags = globalThis;
  if (flags.__UI_SDK_DEV__ === false) {
    return;
  }
  const name = from ? `${from.component}${from.id ? `#${from.id}` : ""}: ` : "";
  emit({ type: "warn", message, component: from?.component, id: from?.id });
  if (strict && flags.__UI_SDK_STRICT__) {
    throw new Error(`[ui-sdk] ${name}${message}`, { cause: detail });
  }
  if (detail === undefined) {
    console.warn(`[ui-sdk] ${name}${message}`);
  } else {
    console.warn(`[ui-sdk] ${name}${message}`, detail);
  }
}
var needMessages = {
  focus: 'takes focus, so its slot needs `focus`: "roving", "tab-stop", "active-descendant" or "native", or `{ none: "why" }` when another element takes it',
  press: "activates, so its slot needs `press`",
  keys: 'moves with keys, so its slot needs `keys`, the keys its `on.keydown` handles, or `{ none: "why" }` when another element handles them',
  keydown: "lists `keys`, so its slot needs an `on.keydown` that handles them"
};
function checkRoles(slots, from) {
  for (const [slot, definition] of Object.entries(slots)) {
    const { role, roles } = definition;
    if (role === undefined) {
      continue;
    }
    if (typeof role === "function" && !roles?.length) {
      warn(`the "${slot}" part picks its role from state, so its slot lists every role it can pick in \`roles\`.`, from);
    }
    for (const each of typeof role === "string" ? [role] : roles ?? []) {
      if (!knownRoles.has(each)) {
        warn(`the "${slot}" part's role "${each}" isn't a WAI-ARIA role.`, from);
      }
      for (const need of unmetNeeds(each, definition)) {
        warn(`the "${slot}" part is ${/^[aeiou]/.test(each) ? "an" : "a"} ${each}, which ${needMessages[need]}.`, from);
      }
    }
  }
}
var warnedRole = /* @__PURE__ */ new WeakSet;
var warnedAria = /* @__PURE__ */ new WeakMap;
function checkRole(definition, slot, own, role, from, live) {
  if (typeof role === "string") {
    checkAria(definition, slot, role, { ...own, ...live }, from);
  }
  if (warnedRole.has(definition)) {
    return;
  }
  if (own?.role !== undefined && definition.role !== undefined) {
    warnedRole.add(definition);
    warn(`the "${slot}" part declares its role, and its \`attrs\` writes one too. Leave \`role\` out of \`attrs\`.`, from);
  } else if (typeof definition.role === "function" && role !== undefined && !definition.roles?.includes(role)) {
    warnedRole.add(definition);
    warn(`the "${slot}" part picked the role "${String(role)}", which its slot's \`roles\` doesn't list.`, from);
  }
}
function checkAria(definition, slot, role, written, from) {
  const { notAllowed, missing } = ariaProblems(role, written);
  if (!notAllowed.length && !missing.length) {
    return;
  }
  let warned = warnedAria.get(definition);
  if (!warned) {
    warnedAria.set(definition, warned = /* @__PURE__ */ new Set);
  }
  const a = /^[aeiou]/.test(role) ? "an" : "a";
  for (const name of notAllowed) {
    if (warned.has(name)) {
      continue;
    }
    warned.add(name);
    warn(`the "${slot}" part is ${a} ${role}, which doesn't take \`${name}\`, so assistive technology ignores it.`, from);
  }
  for (const name of missing) {
    if (warned.has(name)) {
      continue;
    }
    warned.add(name);
    warn(`the "${slot}" part is ${a} ${role}, which needs \`${name}\`, and neither its \`attrs\` nor its \`live\` writes it.`, from);
  }
}
var focusesOnItsOwn = 'button, input, select, textarea, a[href], summary, iframe, [contenteditable]:not([contenteditable="false"])';
function checkFocus(focus, slot, el, from) {
  if (typeof focus !== "string" || typeof Element === "undefined" || !(el instanceof Element)) {
    return;
  }
  setTimeout(() => {
    if (!el.isConnected || el.closest('[aria-disabled="true"], [disabled], [inert], [hidden]')) {
      return;
    }
    const tag = `<${el.localName}>`;
    if (focus === "native" && !el.matches(focusesOnItsOwn)) {
      warn(`the "${slot}" part's focus is "native", but a ${tag} doesn't take focus on its own. Render a native control, or use "roving" or "tab-stop" with a tabindex.`, from);
    } else if ((focus === "roving" || focus === "tab-stop") && !el.hasAttribute("tabindex") && !el.matches(focusesOnItsOwn)) {
      warn(`the "${slot}" part's focus is "${focus}", but its ${tag} has no tabindex, so it can't take focus.`, from);
    } else if (focus === "active-descendant" && !el.id) {
      warn(`the "${slot}" part's focus is "active-descendant", but it has no id for \`aria-activedescendant\` to point at.`, from);
    }
  });
}
var warnedMissing = /* @__PURE__ */ new WeakMap;
function warnMissing(slots, from) {
  const warned = warnedMissing.get(slots) ?? /* @__PURE__ */ new Set;
  warnedMissing.set(slots, warned);
  return new Proxy(slots, {
    get(target, slot) {
      if (typeof slot != "string" || slot in target) {
        return target[slot];
      }
      if (!warned.has(slot)) {
        warned.add(slot);
        warn(`the "${slot}" part isn't defined. A part that ships with a feature registers it with \`use\` before it renders.`, from);
      }
      return {};
    }
  });
}
var controls = /* @__PURE__ */ new WeakMap;
function checkControlled(from, keys, options) {
  const values = options;
  let control = controls.get(from);
  if (!control) {
    controls.set(from, control = { was: /* @__PURE__ */ new Map, warned: /* @__PURE__ */ new Set });
  }
  const { was, warned } = control;
  const once = (key, message) => {
    if (warned.has(key)) {
      return;
    }
    warned.add(key);
    warn(message, from);
  };
  for (const key of keys) {
    const fallback = defaultName(key);
    const isControlled = values[key] !== undefined;
    if (isControlled && !was.has(key) && values[fallback] !== undefined) {
      once(`${key}+`, `got \`${key}\` and \`${fallback}\`. Pass one.`);
    }
    if (was.get(key) && !isControlled) {
      once(key, `stopped controlling \`${key}\`: it was passed and is now undefined, so the component keeps its last value.`);
    }
    was.set(key, isControlled);
  }
}
var installed = false;
function install() {
  installed = true;
  const realm = globalThis;
  realm.__UI_SDK__ ??= {
    changes: (filter = {}) => history.changes.filter((change) => (!filter.component || change.component === filter.component) && (!filter.id || change.id === filter.id) && (!filter.key || change.key === filter.key)),
    layers: () => history.layers,
    shortcuts: () => history.shortcuts?.() ?? [],
    warnings: () => history.warnings
  };
}
var measuring = 0;
var isMeasuring = () => measuring > 0;

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/details.js
var programmaticReasons = /* @__PURE__ */ new Set([
  "image-load",
  "image-error",
  "imperative",
  "item-removed",
  "unmount",
  "reset",
  "restore",
  "timeout",
  "resize",
  "page-hide"
]);
var cause;
function resolveSource(reason, eventSource) {
  if (cause === "agent") {
    return cause;
  }
  if (programmaticReasons.has(reason)) {
    return "programmatic";
  }
  if (eventSource) {
    const source = eventSource();
    return source === "programmatic" && cause ? cause : source;
  }
  return cause ?? "programmatic";
}
function withSource(source, run) {
  const outer = cause;
  cause = source;
  try {
    return run();
  } finally {
    cause = outer;
  }
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/action.js
var DEFAULT_PENDING_ANNOUNCEMENT = "Loading";
var PENDING_ANNOUNCE_DELAY = 1000;
var popupResults = /* @__PURE__ */ new WeakSet;
var isPromise = (value) => !!value && typeof value.then === "function" && !popupResults.has(value);
var canceledAction = /* @__PURE__ */ Symbol("canceled action");
function runAction(action, source, handlers) {
  const failed = (error) => {
    note("an action failed. The error is in its part's `error` state.", undefined, error);
    handlers.failed(error);
  };
  const done = () => withSource(source, handlers.done);
  let result;
  try {
    result = action({ source });
  } catch (error) {
    return failed(error);
  }
  if (result === canceledAction) {
    return;
  }
  if (!isPromise(result)) {
    return done();
  }
  handlers.pending(true);
  result.then(() => {
    handlers.pending(false);
    done();
  }, (error) => {
    handlers.pending(false);
    failed(error);
  });
}
function announcePending(context, isPending) {
  const say = () => {
    const text = context.options().pendingAnnouncement ?? DEFAULT_PENDING_ANNOUNCEMENT;
    Promise.resolve().then(() => (init_announce(), {})).then(({}) => wasPending && announce(text), () => {});
  };
  let timer;
  let wasPending = false;
  const unsubscribe = context.store.subscribe(() => {
    const pending = isPending();
    if (pending === wasPending) {
      return;
    }
    wasPending = pending;
    clearTimeout(timer);
    if (pending) {
      timer = setTimeout(say, PENDING_ANNOUNCE_DELAY);
    }
  });
  context.onDestroy(() => {
    wasPending = false;
    clearTimeout(timer);
    unsubscribe();
  });
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/platform/button.js
function buttonElement(el) {
  if (el.tagName === "BUTTON") {
    return "button";
  }
  if (el.matches("a[href]")) {
    return "link";
  }
  return "other";
}
function buttonRole(elementOf) {
  return {
    role: (state, context) => elementOf(state, context) === "other" ? "button" : undefined,
    roles: ["button"]
  };
}
function buttonElementAttrs(element, options) {
  const native = element === "button";
  const unknown = element === "unknown";
  const mayBeNative = native || unknown;
  const unfocusable = options.disabled && !options.focusable;
  const leavesTabOrder = unfocusable && !mayBeNative;
  const defaultTabindex = leavesTabOrder ? "-1" : element === "other" ? "0" : undefined;
  return {
    type: mayBeNative ? options.type : undefined,
    disabled: mayBeNative && unfocusable ? "" : undefined,
    "aria-disabled": options.disabled && (unknown || !(native && unfocusable)) ? "true" : undefined,
    tabindex: options.tabindex ?? defaultTabindex
  };
}
function keyClick(event, el) {
  if (trusted(event)) {
    withSource("keyboard", () => el.click());
  } else {
    el.click();
  }
}
function buttonKeydown(event, el) {
  if (event.target !== el || buttonElement(el) !== "other") {
    return;
  }
  if (event.key === "Enter") {
    event.preventDefault();
    if (!event.repeat) {
      keyClick(event, el);
    }
  } else if (event.key === " ") {
    event.preventDefault();
  }
}
function buttonKeyup(event, el) {
  if (event.target === el && event.key === " " && buttonElement(el) === "other") {
    keyClick(event, el);
  }
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/keep.js
var lifecycles = /* @__PURE__ */ new WeakMap;
var making;
var deferring = false;
var destroying = 0;
function whileDestroying(run) {
  destroying++;
  try {
    run();
  } finally {
    destroying--;
  }
}
function withLifecycle(make) {
  const outer = making;
  const lifecycle = { starts: [] };
  making = lifecycle;
  let instance;
  try {
    instance = make();
  } finally {
    making = outer;
  }
  lifecycles.set(instance, lifecycle);
  if (outer) {
    outer.starts.push(() => {
      keep2(instance);
      return () => release(instance);
    });
  } else if (!deferring && typeof document !== "undefined") {
    keep2(instance);
  }
  return instance;
}
function unwatched(make) {
  const outer = deferring;
  deferring = true;
  try {
    return make();
  } finally {
    deferring = outer;
  }
}
function whenKept(start) {
  if (making) {
    making.starts.push(start);
  } else if (dev) {
    warn("`whenKept` runs only while an instance is made, so this work never starts.");
  }
}
function extendLifecycle(instance, run) {
  const outer = making;
  const added = { starts: [] };
  making = added;
  try {
    run();
  } finally {
    making = outer;
  }
  const lifecycle = lifecycles.get(instance);
  if (!lifecycle) {
    return;
  }
  lifecycle.starts.push(...added.starts);
  for (const start of lifecycle.stops ? added.starts : []) {
    const stop = start();
    if (stop) {
      lifecycle.stops.push(stop);
    }
  }
}
function keep2(instance) {
  const lifecycle = lifecycles.get(instance);
  if (!lifecycle || lifecycle.stops) {
    return;
  }
  const stops = lifecycle.stops = [];
  for (const start of lifecycle.starts) {
    const stop = start();
    if (stop) {
      stops.push(stop);
    }
  }
}
function release(instance) {
  const lifecycle = lifecycles.get(instance);
  const stops = lifecycle?.stops;
  if (!stops) {
    return;
  }
  lifecycle.stops = undefined;
  stops.forEach((stop) => stop());
}
function discard(instance) {
  release(instance);
  lifecycles.delete(instance);
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/controller.js
var attach = /* @__PURE__ */ Symbol.for("ui-sdk.controller.attach");
var detach = /* @__PURE__ */ Symbol.for("ui-sdk.controller.detach");
function attachController(controller, api) {
  controller?.[attach]?.(api);
}
function detachController(controller, api) {
  controller?.[detach]?.(api);
}
function connectController(context, api) {
  let current = context.options().controller;
  let kept = false;
  whenKept(() => {
    kept = true;
    attachController(current, api);
    return () => {
      kept = false;
      detachController(current, api);
    };
  });
  context.onOptions(({ controller }) => {
    if (controller === current) {
      return;
    }
    detachController(current, api);
    current = controller;
    if (kept) {
      attachController(controller, api);
    }
  });
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/derive.js
var derivations = /* @__PURE__ */ new WeakMap;
function withDerived(store, options, synced, state) {
  const list = derivations.get(store);
  if (!list) {
    return synced;
  }
  let result = synced ?? {};
  for (const derivation of list) {
    if (!synced && derivation.from === "state") {
      continue;
    }
    const next = { ...state, ...result };
    const derived = derivation.from === "state" ? store.view(next, () => derivation.derive(next)) : derivation.derive(result, state, options);
    result = { ...result };
    for (const key of derivation.keys) {
      if (derived && key in derived) {
        result[key] = derived[key];
      } else if (derivation.from === "state") {
        result[key] = next[key];
      }
    }
  }
  return synced || Object.keys(result).length ? result : undefined;
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/part.js
init_style();
init_events();

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/store.js
var changedInPlace = /* @__PURE__ */ new WeakSet;
function sameValue(a, b) {
  if (Object.is(a, b)) {
    return true;
  }
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return false;
  }
  if (changedInPlace.has(a) || changedInPlace.has(b)) {
    return false;
  }
  return a.every((item, index) => Object.is(item, b[index]));
}
var isPlainObject = (value) => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};
function sameSlotState(a, b) {
  return sameWithin(a, b, undefined);
}
function sameWithin(a, b, open) {
  if (Object.is(a, b)) {
    return true;
  }
  const arrays = Array.isArray(a) && Array.isArray(b);
  if (!arrays && !(isPlainObject(a) && isPlainObject(b))) {
    return false;
  }
  if (open) {
    for (let index = 0;index < open.length; index += 2) {
      if (open[index] === a && open[index + 1] === b) {
        return true;
      }
    }
  }
  const within = open ?? [];
  within.push(a, b);
  try {
    if (arrays) {
      const left2 = a;
      const right2 = b;
      if (left2.length !== right2.length || changedInPlace.has(left2) || changedInPlace.has(right2)) {
        return false;
      }
      for (let index = 0;index < left2.length; index++) {
        if (!sameWithin(left2[index], right2[index], within)) {
          return false;
        }
      }
      return true;
    }
    const left = a;
    const right = b;
    const keys = Object.keys(left);
    if (keys.length !== Object.keys(right).length) {
      return false;
    }
    for (const key of keys) {
      if (!(key in right) || !sameWithin(left[key], right[key], within)) {
        return false;
      }
    }
    return true;
  } finally {
    within.length -= 2;
  }
}
function createStore(initial, live) {
  let state = initial;
  let renders2 = 0;
  let writes2 = 0;
  let followed;
  let merged;
  let reading = false;
  let viewed;
  const listeners = /* @__PURE__ */ new Set;
  const skipping = /* @__PURE__ */ new Map;
  let fanout;
  const store = {
    get() {
      return viewed ?? withFollowed();
    },
    set(patch, delivered = false) {
      if (followed && !delivered && !reading) {
        const over = withFollowed();
        if (over !== state) {
          const rest = { ...over };
          for (const key in patch) {
            delete rest[key];
          }
          store.set(rest, true);
        }
      }
      const changed = [];
      for (const key in patch) {
        if (!sameValue(state[key], patch[key])) {
          changed.push(key);
        }
      }
      if (!changed.length) {
        return;
      }
      const previous = state;
      state = { ...state, ...patch };
      const liveOnly = changed.every((key) => live.includes(key));
      notify(changed, previous, liveOnly, delivered);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setFanout(next) {
      fanout = next;
    },
    follow(read) {
      followed = read;
    },
    view(next, read) {
      const before = viewed;
      viewed = next;
      try {
        return read();
      } finally {
        viewed = before;
      }
    }
  };
  function withFollowed() {
    if (!followed || reading) {
      return state;
    }
    reading = true;
    let over;
    try {
      over = followed(state);
    } finally {
      reading = false;
    }
    if (!over) {
      return state;
    }
    if (merged?.state === state && merged.over === over) {
      return merged.result;
    }
    let result = state;
    for (const key in over) {
      if (!sameValue(state[key], over[key])) {
        result = { ...state, ...over };
        break;
      }
    }
    merged = { state, over, result };
    return result;
  }
  function notify(changed, previous, liveOnly, delivered) {
    if (!liveOnly) {
      renders2++;
    }
    if (!delivered) {
      writes2++;
    }
    const run = (listener) => listener(liveOnly, delivered, changed);
    listeners.forEach(run);
    for (const [skip, group] of skipping) {
      if (!changed.length || changed.some((key) => !Object.hasOwn(skip, key))) {
        group.forEach(run);
      }
    }
    fanout?.(changed, previous, run);
  }
  held.set(store, {
    state: () => state,
    renders: () => renders2,
    writes: () => writes2,
    touch: () => notify([], state, false, false),
    skipping
  });
  return store;
}
var held = /* @__PURE__ */ new WeakMap;
function subscribeSkipping(store, skip, listener) {
  return join(held.get(store).skipping, skip, listener);
}
function join(groups, group, listener) {
  let members = groups.get(group);
  if (!members) {
    groups.set(group, members = /* @__PURE__ */ new Set);
  }
  members.add(listener);
  return () => {
    members.delete(listener);
    if (!members.size && groups.get(group) === members) {
      groups.delete(group);
    }
  };
}
var heldState = (store) => held.get(store).state();
var renders = (store) => held.get(store).renders();
var standFor = (owner, store) => {
  held.set(owner, held.get(store));
};
var touch = (store) => held.get(store).touch();

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/part.js
var ownerOf = (part) => part.owner;
var definitionOf = (part) => ownerOf(part).slots[part.slot];
var view = (part, props) => ({
  id: part.id,
  key: part.key,
  props,
  api: part.api
});
var context = (part, props = part.props) => ({
  el: part.el,
  id: part.id,
  key: part.key,
  props,
  store: part.store,
  api: part.api
});
function lease(part) {
  const { parts } = part.owner;
  const mapKey = `${part.slot}:${part.key}`;
  if (!parts.has(mapKey)) {
    parts.set(mapKey, part);
  }
  part.leases++;
  let held2 = true;
  return () => {
    if (!held2) {
      return;
    }
    held2 = false;
    if (--part.leases) {
      return;
    }
    const { owner } = part;
    if (!owner.released.length) {
      queueMicrotask(() => sweep(owner));
    }
    owner.released.push(part);
  };
}
function provisional(part) {
  const { owner } = part;
  if (!owner.released.length) {
    queueMicrotask(() => sweep(owner));
  }
  owner.released.push(part);
}
function sweep(owner) {
  for (const part of owner.released) {
    const mapKey = `${part.slot}:${part.key}`;
    if (!part.leases && owner.parts.get(mapKey) === part) {
      owner.parts.delete(mapKey);
    }
  }
  owner.released = [];
}
function attrs(part, props = part.props, state = part.store.get()) {
  const definition = definitionOf(part);
  const context2 = view(part, props);
  const own = definition.attrs?.(state, context2);
  const declared = definition.role;
  const role = typeof declared === "function" ? declared(state, context2) : declared;
  if (dev) {
    checkRole(definition, part.slot, own, role, { component: ownerOf(part).label, id: part.id }, definition.live?.read(state, context2));
  }
  const { name } = ownerOf(part);
  const result = {
    "data-slot": part.slot === "root" ? name : `${name}-${part.slot}`,
    ...declared === undefined ? undefined : { role },
    ...own
  };
  if (declared !== undefined) {
    result.role = role;
  }
  return aliased(part, result);
}
var authorOwned = /* @__PURE__ */ new Set([
  "aria-label",
  "aria-labelledby",
  "aria-description",
  "title",
  "autocomplete",
  "autocapitalize",
  "autocorrect",
  "spellcheck",
  "inputmode",
  "enterkeyhint"
]);
function yieldToAuthor(attrs2, given) {
  let result;
  for (const name in attrs2) {
    if (attrs2[name] !== undefined && authorOwned.has(name) && given(name)) {
      (result ??= { ...attrs2 })[name] = undefined;
    }
  }
  return result ?? attrs2;
}
var madeLabel = (value) => typeof value === "string" && value.split(/\s+/).every((id) => id.startsWith("ui-sdk-"));
function partState(part, props = part.props, state = part.store.get()) {
  return definitionOf(part).state?.(state, view(part, props)) ?? {};
}
function present(part, props = part.props, state = part.store.get()) {
  return definitionOf(part).present?.(state, view(part, props)) ?? true;
}
function conditional(part) {
  return definitionOf(part).present !== undefined;
}
var directNames = (part) => definitionOf(part).direct?.names;
var selectedKeys = (part, props = part.props) => definitionOf(part).selects?.selection(part, props) ?? "";
var skipNone = {};
function subscribe(part, listener, props = part.props) {
  const narrowed = definitionOf(part).selects;
  const cleanups = [
    lease(part),
    narrowed ? narrowed.subscribe(part, listener, props) : subscribeSkipping(part.store, skipNone, listener)
  ];
  return () => cleanups.forEach((cleanup) => cleanup());
}
function handlers(part) {
  const { on: events, press: activate } = definitionOf(part);
  const result = {};
  for (const type in events) {
    const handler = events[type];
    result[type] = (event) => {
      if (event.defaultPrevented || composing(event)) {
        return;
      }
      ownerOf(part).sleeping?.wake();
      handler(event, context(part));
    };
  }
  if (typeof activate === "function" && !result.click) {
    result.click = (event) => {
      if (!event.defaultPrevented) {
        ownerOf(part).sleeping?.wake();
        activate(context(part), event);
      }
    };
  }
  return result;
}
function commit(part, props) {
  if (part.props === props) {
    return;
  }
  part.props = props;
  propsRendered(part);
}
function propsRendered(part) {
  part.propsListeners?.forEach((listener) => listener());
}
var hidingSlots = /* @__PURE__ */ new WeakMap;
function canHide(part) {
  const definition = definitionOf(part);
  let hides = hidingSlots.get(definition);
  if (hides === undefined) {
    hides = !!definition.attrs && "hidden" in definition.attrs(part.store.get(), view(part, part.props));
    hidingSlots.set(definition, hides);
  }
  return hides;
}
function bind(part, el, host = { by: "core" }) {
  const kept = part;
  const { parts } = kept.owner;
  const mapKey = `${part.slot}:${part.key}`;
  if (!part.el && (parts.get(mapKey) ?? kept) === kept) {
    parts.delete(mapKey);
    parts.set(mapKey, kept);
  }
  if (dev) {
    checkShared(part, part.el, el);
    const { focus } = definitionOf(part);
    checkFocus(typeof focus === "function" ? focus(part.store.get(), view(part, part.props)) : focus, part.slot, el, {
      component: ownerOf(part).label,
      id: part.id
    });
  }
  const binding = {};
  part.el = el;
  kept.binding = binding;
  const cleanups = [lease(kept)];
  if (canHide(part)) {
    enforceHidden(el.ownerDocument);
  }
  for (const [type, handler] of Object.entries(handlers(part))) {
    if (host.by === "core" || host.attaches !== "all" && !host.attaches.includes(type)) {
      cleanups.push(on(el, type, handler));
    }
  }
  const definition = definitionOf(part);
  if (definition.live) {
    cleanups.push(definition.live.attach(part, el));
  }
  if (host.by === "framework" && definition.direct) {
    cleanups.push(definition.direct.attach(part, el));
  }
  const early = definition.asleep?.(el, part);
  if (early) {
    cleanups.push(early);
  }
  const late = () => {
    const cleanup = definition.bind?.(el, part);
    if (cleanup) {
      cleanups.push(cleanup);
    }
  };
  const { sleeping } = kept.owner;
  if (sleeping && definition.bind) {
    sleeping.binds.add(late);
    cleanups.push(() => sleeping.binds.delete(late));
  } else {
    late();
  }
  if (definition.attrs && typeof MutationObserver !== "undefined") {
    cleanups.push(followId(kept, el));
  }
  return () => {
    cleanups.forEach((cleanup) => cleanup());
    if (kept.binding !== binding) {
      return;
    }
    part.el = kept.binding = undefined;
    if (kept.own !== undefined) {
      readIdLater(kept);
    }
  };
}
function checkShared(part, bound, el) {
  if (!part.key || !bound || bound === el) {
    return;
  }
  queueMicrotask(() => {
    if (part.el !== el || !bound.isConnected || !el.isConnected) {
      return;
    }
    const { parts, label } = ownerOf(part);
    for (const other of parts.values()) {
      if (other.el === bound) {
        return;
      }
    }
    warn(`two "${part.slot}" parts share the key "${part.key}". Give each an id or a unique value.`, {
      component: label,
      id: part.id
    });
  });
}
function ref(part, host) {
  const kept = part;
  if (kept.ref) {
    return kept.ref;
  }
  let current = null;
  let unbind = () => {};
  return kept.ref = (el) => {
    if (el === current) {
      return;
    }
    if (dev && el) {
      checkShared(part, current, el);
    }
    unbind();
    current = el;
    unbind = el ? bind(part, el, host) : () => {};
  };
}
var connect = (part, el) => definitionOf(part).connect?.(el) ?? (() => {});
var references = [
  "aria-activedescendant",
  "aria-controls",
  "aria-describedby",
  "aria-details",
  "aria-errormessage",
  "aria-flowto",
  "aria-labelledby",
  "aria-owns",
  "for",
  "headers"
];
var madeId = (part) => definitionOf(part).attrs?.(part.store.get(), view(part, { ...part.props, id: undefined })).id;
function aliased(part, attrs2) {
  const { owner } = part;
  if (!owner.named?.size || !references.some((name) => attrs2[name])) {
    return attrs2;
  }
  const aliases = aliasesOf(owner, part.store);
  if (!aliases.size) {
    return attrs2;
  }
  const result = { ...attrs2 };
  for (const name of references) {
    const ids = result[name];
    if (ids) {
      result[name] = ids.split(" ").map((id) => aliases.get(id) ?? id).join(" ");
    }
  }
  return result;
}
function aliasesOf(owner, store) {
  const version = renders(store);
  if (owner.aliases?.version === version) {
    return owner.aliases.map;
  }
  const map = /* @__PURE__ */ new Map;
  for (const part of owner.named) {
    const made = madeId(part);
    if (made !== undefined && made !== part.own) {
      map.set(made, part.own);
    }
  }
  owner.aliases = { version, map };
  return map;
}
function followId(part, el) {
  if (el.hasAttribute("id") || part.own !== undefined) {
    readIdLater(part);
  }
  const observer = new MutationObserver(() => readIdLater(part));
  observer.observe(el, { attributeFilter: ["id"] });
  return () => observer.disconnect();
}
function readIdLater(part) {
  const { owner } = part;
  if (!owner.unread) {
    owner.unread = /* @__PURE__ */ new Set;
    queueMicrotask(() => readIds(owner, part.store));
  }
  owner.unread.add(part);
}
function readIds(owner, store) {
  const parts = owner.unread;
  owner.unread = undefined;
  let renamed = owner.renamed === true;
  owner.renamed = undefined;
  for (const part of parts) {
    renamed = rename(part, part.el && idOf(part.el)) || renamed;
  }
  if (renamed) {
    touch(store);
  }
}
var idOf = (el) => el.localName === "form" ? el.getAttribute("id") : el.id;
function takeOwnId(part, id) {
  if (part.el || typeof id !== "string" || !definitionOf(part).attrs) {
    return;
  }
  if (rename(part, id)) {
    ownerOf(part).renamed = true;
  }
}
function rename(part, id) {
  const made = madeId(part);
  const own = id && id !== made ? id : undefined;
  if (own === part.own) {
    return false;
  }
  const { owner } = part;
  part.own = own;
  owner.named ??= /* @__PURE__ */ new Set;
  if (own === undefined) {
    owner.named.delete(part);
  } else {
    owner.named.add(part);
  }
  owner.aliases = undefined;
  return made !== undefined;
}
function composing(event) {
  return (event.type === "keydown" || event.type === "keyup") && isComposing(event);
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/watchers.js
var watchers = {};
var earlier = /* @__PURE__ */ new Set;
var watchLater = /* @__PURE__ */ new WeakMap;
function watchWhileKept(instance, parts, definition) {
  let unwatch;
  let waiting;
  const untrack = () => {
    unwatch?.();
    unwatch = undefined;
    if (waiting) {
      earlier.delete(waiting);
    }
    waiting = undefined;
  };
  whenKept(() => {
    if (watchers.add) {
      unwatch = watchers.add(instance, parts, definition);
    } else if (typeof document !== "undefined") {
      earlier.add(waiting = new WeakRef(instance));
      watchLater.set(instance, () => unwatch = watchers.add?.(instance, parts, definition));
      if (earlier.size % 1000 === 0) {
        for (const old of earlier) {
          if (!old.deref()) {
            earlier.delete(old);
          }
        }
      }
    }
    return untrack;
  });
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/primitive.js
function definePrimitive(definition) {
  const slots = definition.slots((slot) => slot);
  const name = definition.name;
  const label = definition.label ?? name;
  if (dev) {
    checkRoles(slots, { component: label });
  }
  const make = (initialOptions) => {
    let options = initialOptions;
    const id = initialOptions.id;
    const store = createStore({ ...definition.state(options), ...definition.sync?.(options) }, definition.live ?? []);
    const destroys = [];
    const optionsListeners = [];
    const from = { component: label, id };
    const controlled = dev ? (definition.controlled ?? ["open", "value", "checked"]).filter((key) => (key in store.get())) : [];
    if (dev) {
      checkControlled(from, controlled, options);
    }
    const own = Object.create(dev ? warnMissing(slots, from) : slots);
    const used = /* @__PURE__ */ new Set;
    function use(feature) {
      if (used.has(feature)) {
        return;
      }
      used.add(feature);
      Object.assign(own, feature.slots);
      wake();
      feature.extend?.(api);
    }
    const owner = {
      name,
      label,
      slots: own,
      parts: /* @__PURE__ */ new Map,
      released: []
    };
    const { parts } = owner;
    function keyOf(props = {}) {
      return props.id ?? (props.value == null ? "" : String(props.value));
    }
    let viewedParts;
    function part(slot, props = {}, rendering = false) {
      const key = keyOf(props);
      const mapKey = `${slot}:${key}`;
      let found = parts.get(mapKey);
      if (!found) {
        parts.set(mapKey, found = {
          slot,
          key,
          id,
          get api() {
            return api;
          },
          store,
          props,
          el: undefined,
          owner,
          leases: 0
        });
        if (rendering) {
          provisional(found);
        }
      } else if (rendering) {
        return found;
      }
      found.props = props;
      propsRendered(found);
      return found;
    }
    function element(slot, key) {
      if (key === undefined) {
        for (const part2 of parts.values()) {
          if (part2.slot === slot && part2.el?.isConnected) {
            return part2.el;
          }
        }
        return;
      }
      const el = parts.get(`${slot}:${key}`)?.el;
      return el?.isConnected ? el : undefined;
    }
    const context = {
      id,
      label,
      store,
      options: () => options,
      onOptions: (listener) => optionsListeners.push(listener),
      onDestroy: (cleanup) => destroys.push(cleanup),
      parts: () => parts.values(),
      element,
      props: (slot, key = "") => {
        const shown = viewedParts?.[slot];
        return shown && keyOf(shown) === key ? shown : parts.get(`${slot}:${key}`)?.props;
      }
    };
    let api = undefined;
    function build() {
      api = definition.api(context);
      connectController(context, api);
      if (dev) {
        for (const action of definition.agent?.actions ?? []) {
          if (typeof api[action] !== "function") {
            warn(`lists \`${action}\` in \`agent.actions\`, but its api has no such method.`, from);
          }
        }
      }
    }
    function wake() {
      const { sleeping } = owner;
      if (!sleeping) {
        return;
      }
      owner.sleeping = undefined;
      extendLifecycle(instance, build);
      for (const bind of [...sleeping.binds]) {
        bind();
      }
    }
    if (definition.asleep?.(options)) {
      owner.sleeping = { wake, binds: /* @__PURE__ */ new Set };
    } else {
      build();
    }
    let handing = false;
    let following = false;
    let destroyed = false;
    const syncFrom = (options2, state) => withDerived(store, options2, definition.sync?.(options2), state);
    const instance = {
      types: undefined,
      name,
      id,
      get: store.get,
      subscribe: store.subscribe,
      get api() {
        wake();
        return api;
      },
      part,
      use,
      preview(next) {
        const synced = syncFrom({ ...next, id }, store.get());
        const current = store.get();
        for (const key in synced) {
          if (!sameValue(current[key], synced[key])) {
            return { ...current, ...synced };
          }
        }
      },
      view(state, read, around) {
        const outer = viewedParts;
        viewedParts = around;
        try {
          return store.view(state, read);
        } finally {
          viewedParts = outer;
        }
      },
      setOptions(next) {
        const held = heldState(store);
        const arriving = next.id === id ? next : { ...next, id };
        const shown = dev && following ? syncFrom(arriving, held) : undefined;
        options = arriving;
        if (dev) {
          checkControlled(from, controlled, options);
        }
        if (owner.sleeping && !definition.asleep(options)) {
          wake();
        }
        const synced = syncFrom(options, held);
        if (dev && shown) {
          const torn = tornKeys(shown, synced);
          if (torn.length) {
            emit({ type: "relay", ...from, keys: torn });
          }
        }
        let source;
        handing = true;
        try {
          for (const listener of optionsListeners) {
            source = listener(options, synced) ?? source;
          }
          const landing = heldState(store) === held ? synced : syncFrom(options, heldState(store));
          if (landing) {
            withSource(source, () => store.set(landing, true));
          }
        } finally {
          handing = false;
        }
      },
      startState: (next) => definition.state({ ...next, id }),
      follow(current) {
        following = true;
        let last;
        let synced;
        const read = (state = heldState(store), before) => {
          if (before) {
            return syncFrom({ ...before, id }, state);
          }
          if (destroyed) {
            return synced;
          }
          const options2 = current();
          if (last?.options !== options2 || last.state !== state) {
            last = { options: options2, state };
            synced = syncFrom({ ...options2, id }, state);
          }
          return synced;
        };
        store.follow(read);
        if (dev) {
          store.subscribe((_, delivered, keys) => {
            if (handing && !delivered && !isMeasuring()) {
              emit({ type: "relay", ...from, keys: [...keys] });
            }
          });
        }
        return read;
      },
      destroy() {
        if (destroyed) {
          return;
        }
        destroyed = true;
        discard(instance);
        whileDestroying(() => destroys.forEach((cleanup) => cleanup()));
        if (dev) {
          emit({ type: "instance", action: "destroy", ...from, controlled });
        }
      }
    };
    standFor(instance, store);
    watchWhileKept(instance, parts, definition);
    if (dev) {
      emit({ type: "instance", action: "create", ...from, controlled });
    }
    return instance;
  };
  const create = (initialOptions) => withLifecycle(() => make(initialOptions));
  Object.defineProperty(create, "name", { value: name });
  return Object.assign(create, {
    options: definition.options,
    slots
  });
}
function tornKeys(shown, landed) {
  const before = shown;
  const after = landed ?? {};
  const keys = /* @__PURE__ */ new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].filter((key) => !sameValue(before[key], after[key]));
}
var schemas = /* @__PURE__ */ new WeakMap;
function schemaOf(primitive) {
  let schema = schemas.get(primitive);
  if (!schema) {
    const { options, slots = {} } = primitive;
    schema = {
      options: { debug: "boolean", ...options },
      slots: Object.fromEntries(Object.entries(slots).map(([slot, def]) => [
        slot,
        def.props ?? {}
      ]))
    };
    schemas.set(primitive, schema);
  }
  return schema;
}
var renderVersion = (instance) => renders(instance);

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/change.js
function debug(context, key, value, reason, source) {
  if (dev && context.options().debug) {
    console.debug(`[ui-sdk] ${context.label}#${context.id} ${key}: ${String(value)} (${reason}, ${source})`);
  }
}
function log(context, key, value, details) {
  const source = details.source ?? resolveSource(details.reason);
  if (dev) {
    emit({
      type: "change",
      component: context.label,
      id: context.id,
      key,
      value,
      reason: details.reason,
      source,
      canceled: false,
      controlled: false
    });
  }
  debug(context, key, value, details.reason, source);
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/modality.js
var modality = "pointer";
var installed2 = false;
var scheduled = false;
var windowLeft = false;
var lastPointer = "mouse";
var pointerPressed = false;
var forgetPointerPress = () => pointerPressed = false;
var keyTarget = null;
var forgetKeyTarget = () => keyTarget = null;
function noteKey(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  keyTarget = event.target;
  setTimeout(forgetKeyTarget);
}
function noteKeydown(event) {
  noteKey(event);
  windowLeft = false;
  const modifierOnly = event.metaKey || event.ctrlKey || event.altKey || /^(Meta|Control|Alt|Shift)$/.test(event.key);
  if (event.key === "Tab" || !modifierOnly) {
    modality = "keyboard";
  }
}
function notePress(event) {
  modality = "pointer";
  windowLeft = false;
  if (!("pointerType" in event)) {
    if (!pointerPressed) {
      lastPointer = "touch";
    }
    return;
  }
  pointerPressed = true;
  setTimeout(forgetPointerPress);
  const type = event.pointerType;
  lastPointer = isSyntheticPointer(event) ? "virtual" : type === "touch" || type === "pen" ? type : "mouse";
}
function install2() {
  if (installed2 || typeof document === "undefined") {
    return;
  }
  installed2 = true;
  document.addEventListener("keydown", noteKeydown, true);
  document.addEventListener("keyup", noteKey, true);
  document.addEventListener("pointerdown", notePress, true);
  document.addEventListener("touchstart", notePress, {
    capture: true,
    passive: true
  });
  window.addEventListener("blur", (event) => {
    if (event.target === window) {
      windowLeft = true;
    }
  });
}
function trackInput() {
  if (installed2 || scheduled) {
    return;
  }
  scheduled = true;
  queueMicrotask(install2);
}
function isSyntheticPointer(event) {
  if (event.type === "pointermove") {
    return false;
  }
  if (event.width === 0 && event.height === 0 && event.pressure === 0) {
    return true;
  }
  return event.pointerType === "mouse" && event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0;
}
function clickSource(event) {
  if (event.detail > 0) {
    return lastPointer;
  }
  const fromKey = !!keyTarget && keyTarget.contains(event.target);
  return fromKey ? "keyboard" : "virtual";
}
var currentSource = () => modality === "keyboard" ? "keyboard" : lastPointer;
function sourceOf(event) {
  install2();
  if (!event) {
    return currentSource();
  }
  if (!trusted(event)) {
    return "programmatic";
  }
  if (event.type.startsWith("key")) {
    return "keyboard";
  }
  if (event.type.startsWith("touch")) {
    return "touch";
  }
  if (event.type === "click") {
    return clickSource(event);
  }
  const pointerType = event.pointerType;
  if (pointerType === "mouse" || pointerType === "touch" || pointerType === "pen") {
    return isSyntheticPointer(event) ? "virtual" : pointerType;
  }
  if ("button" in event) {
    return lastPointer;
  }
  return currentSource();
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/input-source.js
var changeSource = (reason, event) => resolveSource(reason, event && (() => sourceOf(event)));
function inputSource() {
  trackInput();
  return changeSource;
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/components/button/button.js
function buttonApiBody(context) {
  const { store, options } = context;
  const changeSource = inputSource();
  const write = (key, value, source) => {
    if (sameValue(store.get()[key], value)) {
      return;
    }
    store.set({ [key]: value });
    log(context, key, value, { reason: "action", source });
  };
  announcePending(context, () => store.get().pending);
  return {
    internal: {
      press(event, action = (details) => options().action?.(event, details)) {
        const state = store.get();
        if (isDisabled(state) || state.pending) {
          return event?.preventDefault();
        }
        const source = changeSource("action", event);
        write("error", undefined, source);
        runAction(action, source, {
          pending: (pending) => write("pending", pending, source),
          done: () => {},
          failed: (error) => write("error", error, source)
        });
      }
    }
  };
}
var buttonApi = buttonApiBody;
var buttonPrimitive = /* @__PURE__ */ definePrimitive({
  name: "button",
  options: {
    disabled: "boolean",
    focusableWhenDisabled: "boolean",
    type: "string",
    pendingAnnouncement: "string",
    action: "action"
  },
  state: (options) => ({
    disabled: !!options.disabled,
    formDisabled: false,
    focusableWhenDisabled: !!options.focusableWhenDisabled,
    type: options.type ?? "button",
    element: "unknown",
    pending: false,
    error: undefined
  }),
  sync: (options) => ({
    disabled: !!options.disabled,
    focusableWhenDisabled: !!options.focusableWhenDisabled,
    type: options.type ?? "button"
  }),
  api: (context) => buttonApi(context),
  slots: (slot) => ({
    root: slot({
      ...buttonRole((state) => state.element),
      focus: "tab-stop",
      state: (state) => ({
        disabled: isDisabled(state),
        pending: state.pending,
        error: state.error
      }),
      attrs: (state) => ({
        ...buttonElementAttrs(state.element, {
          type: state.type,
          disabled: isDisabled(state),
          focusable: state.focusableWhenDisabled
        }),
        ...state.pending && !isDisabled(state) && { "aria-disabled": "true" },
        "aria-busy": state.pending ? "true" : undefined,
        "data-disabled": isDisabled(state) ? "" : undefined,
        "data-pending": state.pending ? "" : undefined
      }),
      press: ({ api }, event) => api.internal.press(event),
      on: {
        keydown: (event, { el }) => buttonKeydown(event, el),
        keyup: (event, { el }) => buttonKeyup(event, el)
      },
      bind(el, { store }) {
        store.set({ element: buttonElement(el) });
        return watchFormDisabled(el, store);
      }
    })
  })
});
var button = buttonPrimitive;

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/platform/platform.js
init_env();
function supportsTopLayer() {
  return isBrowser && typeof HTMLElement.prototype.showPopover === "function";
}
function portalTarget(container) {
  if (container) {
    return container;
  }
  if (isBrowser && !supportsTopLayer()) {
    return document.body;
  }
  return null;
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/kernel/live.js
var applied = /* @__PURE__ */ new WeakMap;
var found = /* @__PURE__ */ new WeakMap;
var writing;
function applyAttrs(el, attrs2, channel = "render") {
  writeAttrs(el, attrs2, channel, false);
}
function releaseAttrs(el, channel) {
  writeAttrs(el, {}, channel, true);
}
function markAuthored(el, name) {
  if (el === writing) {
    return;
  }
  for (const written of Object.values(applied.get(el) ?? {})) {
    written.delete(name);
  }
  for (const values of Object.values(found.get(el) ?? {})) {
    values.delete(name);
  }
}
function writeAttrs(el, attrs2, channel, release) {
  const outer = writing;
  writing = el;
  try {
    writeChannel(el, attrs2, channel, release);
  } finally {
    writing = outer;
  }
}
function writeChannel(el, attrs2, channel, release) {
  const channels = applied.get(el) ?? {};
  const previous = channels[channel] ?? /* @__PURE__ */ new Map;
  const written = /* @__PURE__ */ new Map;
  const styles = attrs2.style === undefined ? [] : styleDeclarations(attrs2.style);
  for (const [property, value] of styles) {
    written.set(`style:${property}`, value);
  }
  for (const [name, value] of Object.entries(attrs2)) {
    if (value !== undefined && name !== "style") {
      written.set(name, value);
    }
  }
  const id = written.has("id") || previous.has("id") ? el.getAttribute("id") : null;
  const keeps = keepsId(id, channels, channel);
  if (keeps) {
    written.delete("id");
  }
  const authors = /* @__PURE__ */ new Set;
  const read = /* @__PURE__ */ new Map;
  for (const name of /* @__PURE__ */ new Set([...written.keys(), ...previous.keys()])) {
    if (!authorOwned.has(name)) {
      continue;
    }
    const current = el.getAttribute(name);
    read.set(name, current);
    if (current === null || current === written.get(name) || name === "aria-labelledby" && madeLabel(current)) {
      continue;
    }
    if (!Object.values(channels).some((wrote) => wrote.get(name) === current)) {
      authors.add(name);
    }
  }
  for (const name of authors) {
    written.delete(name);
  }
  for (const name of previous.keys()) {
    if (written.has(name) || authors.has(name) || name === "id" && keeps) {
      continue;
    }
    if (name.startsWith("style:")) {
      el.style.removeProperty(name.slice(6));
      continue;
    }
    if (!release) {
      el.removeAttribute(name);
      keepFound(el, channel, name, null);
      continue;
    }
    const current = el.getAttribute(name);
    if (current !== previous.get(name)) {
      continue;
    }
    const original = found.get(el)?.[channel]?.get(name);
    if (original === undefined) {
      el.removeAttribute(name);
    } else if (current !== original) {
      el.setAttribute(name, original);
    }
  }
  for (const [property, value] of styles) {
    if (el.style.getPropertyValue(property) !== value) {
      el.style.setProperty(property, value);
    }
  }
  for (const [name, value] of Object.entries(attrs2)) {
    if (value === undefined || !written.has(name)) {
      continue;
    }
    const current = name === "id" ? id : read.has(name) ? read.get(name) : el.getAttribute(name);
    if (current !== (previous.get(name) ?? null)) {
      keepFound(el, channel, name, current);
    }
    if (current === value) {
      continue;
    }
    if (name === "value" && isTextField(el) && el.value !== value) {
      el.value = value;
    }
    el.setAttribute(name, value);
  }
  channels[channel] = written;
  applied.set(el, channels);
  if (release) {
    delete found.get(el)?.[channel];
  }
}
function keepFound(el, channel, name, value) {
  const kept = value == null || name === "id" ? undefined : references.includes(name) ? authoredIds(value) : value;
  if (kept === undefined) {
    return void found.get(el)?.[channel]?.delete(name);
  }
  let channels = found.get(el);
  if (!channels) {
    found.set(el, channels = {});
  }
  (channels[channel] ??= /* @__PURE__ */ new Map).set(name, kept);
}
var authoredIds = (ids) => ids.split(/\s+/).filter((id) => id && !id.startsWith("ui-sdk-")).join(" ") || undefined;
function keepsId(id, channels, channel) {
  if (id === null || id === channels[channel]?.get("id")) {
    return false;
  }
  return !id.startsWith("ui-sdk-") || Object.values(channels).some((written) => written.get("id") === id);
}
var isTextField = (el) => el.localName === "textarea" || el.localName === "input" && el.type !== "file";
function styleDeclarations(css) {
  const declarations = [];
  for (const declaration of css.split(";")) {
    const index = declaration.indexOf(":");
    if (index > 0) {
      declarations.push([
        declaration.slice(0, index).trim(),
        declaration.slice(index + 1).trim()
      ]);
    }
  }
  return declarations;
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/foundation/forms/form-internals.js
var callbacksOf = /* @__PURE__ */ new WeakMap;
var customMessages = /* @__PURE__ */ new WeakMap;
function formCallback(el, type, ...args) {
  if (type === "customValidity") {
    customMessages.set(el, args[0]);
  }
  const callback = callbacksOf.get(el)?.[type];
  callback?.(...args);
  return !!callback;
}
function bindElementInternals(el, internals, options) {
  let reported = "";
  const sync = () => {
    const value = options.value();
    if (value instanceof FormData) {
      internals.setFormValue(value, options.state());
    } else if (Array.isArray(value)) {
      const data = new FormData;
      const name = options.name?.();
      if (name) {
        for (const item of value) {
          data.append(name, item);
        }
      }
      internals.setFormValue(data, options.state());
    } else {
      internals.setFormValue(value, options.state());
    }
    const missing = options.valueMissing();
    const custom = customMessages.get(el);
    const invalid = options.invalid?.();
    if (custom) {
      internals.setValidity({ customError: true }, custom, options.anchor?.() ?? el);
    } else if (invalid) {
      internals.setValidity(invalid.flags, invalid.message, invalid.anchor ?? options.anchor?.() ?? el);
    } else if (missing) {
      internals.setValidity({ valueMissing: true }, options.message(), options.anchor?.() ?? el);
    } else {
      internals.setValidity({});
    }
    if ((invalid?.message ?? "") === reported) {
      return;
    }
    reported = invalid?.message ?? "";
    validityChanged(el);
  };
  sync();
  const unsubscribe = options.subscribe(sync);
  const unfocus = options.focus ? focusWith(el, options.focus) : () => {};
  if (el.matches(":disabled")) {
    options.disabled(true);
  }
  callbacksOf.set(el, {
    reset: () => {
      options.reset();
      sync();
    },
    disabled: (disabled) => options.disabled(disabled),
    restore: (state) => {
      if (typeof state === "string") {
        options.restore(state);
      }
    },
    customValidity: sync
  });
  const unlabel = labelledBy(el, () => labelsOf(el));
  const onInvalid = () => {
    if (options.focus) {
      claimInvalidFocus(el, internals.form);
    }
  };
  el.addEventListener("invalid", onInvalid);
  return () => {
    el.removeEventListener("invalid", onInvalid);
    unsubscribe();
    unlabel();
    callbacksOf.delete(el);
    unfocus();
  };
}

// ../../node_modules/.bun/@ui-sdk+core@0.1.0-beta.6/node_modules/@ui-sdk/core/dist/renderer.js
init_style();

// ../../node_modules/.bun/@ui-sdk+web@0.1.0-beta.6+28ce4433b2aaddba/node_modules/@ui-sdk/web/dist/action.js
function waitList() {
  const waiting = [];
  let dispatching = true;
  const waitUntil = (promise) => {
    if (!dispatching) {
      throw new DOMException("waitUntil() can only be called while the event dispatches.", "InvalidStateError");
    }
    waiting.push(promise);
  };
  const done = () => {
    dispatching = false;
    return waiting;
  };
  return { waitUntil, done };
}
var actionOf = (el) => (_event, details) => {
  const { waitUntil, done } = waitList();
  const proceed = el.dispatchEvent(new CustomEvent("action", {
    cancelable: true,
    composed: true,
    detail: { ...details, waitUntil }
  }));
  const waiting = done();
  if (!proceed) {
    return canceledAction;
  }
  return waiting.length ? Promise.all(waiting) : undefined;
};

// ../../node_modules/.bun/@ui-sdk+web@0.1.0-beta.6+28ce4433b2aaddba/node_modules/@ui-sdk/web/dist/define-element.js
var autoIds = /* @__PURE__ */ new WeakMap;
var count = 0;
var claimed = /* @__PURE__ */ new Set;
function claimTag(tagName) {
  if (typeof customElements === "undefined" || claimed.has(tagName)) {
    return false;
  }
  if (customElements.get(tagName)) {
    warn(`<${tagName}> is already defined by another library or another copy of ui-sdk. This one is skipped.`);
    return false;
  }
  claimed.add(tagName);
  return true;
}
function autoId(el) {
  if (!autoIds.has(el)) {
    autoIds.set(el, `auto-${++count}`);
  }
  return autoIds.get(el);
}
function wrappedButton(el) {
  return el.querySelector(":scope > button, :scope > a") ?? el.firstElementChild;
}
function boundElement(el, target) {
  if (target) {
    return target(el);
  }
  return el.hasAttribute("as-child") ? el.firstElementChild : el;
}
var rekeyed = (previous, next) => previous.id !== next.id || previous.value !== next.value;
var kebab = (name) => name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
var semantics = ["role", "aria-disabled"];
function parseAttribute(type, value) {
  if (value === null) {
    return;
  }
  if (typeof type === "function") {
    return type(value);
  }
  if (type === "boolean") {
    return value !== "false";
  }
  if (type === "number") {
    const number = Number(value);
    return value.trim() === "" || Number.isNaN(number) ? undefined : number;
  }
  if (type === "list") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return value;
}
var presence = /* @__PURE__ */ new Set(["disabled", "required"]);
function readAttribute(el, name, type) {
  const value = el.getAttribute(kebab(name));
  if (type === "boolean" && presence.has(name)) {
    return value === null ? undefined : true;
  }
  return parseAttribute(type, value);
}
function readAttributes(el, schema) {
  const result = {};
  for (const [name, type] of Object.entries(schema)) {
    const value = readAttribute(el, name, type);
    if (value !== undefined) {
      result[name] = value;
    }
  }
  return result;
}
var defaultOn = (el, value) => typeof value === "function" ? value(el) : value;
function reflectAttributes(proto, schema, defaults = {}) {
  for (const [name, type] of Object.entries(schema)) {
    if (name in proto) {
      continue;
    }
    const attribute = kebab(name);
    Object.defineProperty(proto, name, {
      configurable: true,
      get() {
        return readAttribute(this, name, type) ?? defaultOn(this, defaults[name]) ?? (type === "boolean" ? false : undefined);
      },
      set(value) {
        const removes = value === false && type === "boolean" && !defaultOn(this, defaults[name]);
        if (value == null || removes) {
          this.removeAttribute(attribute);
        } else {
          this.setAttribute(attribute, value === true ? "" : Array.isArray(value) ? value.join(",") : String(value));
        }
      }
    });
  }
}
function upgradeProperties(el, names) {
  for (const name of names) {
    if (!Object.prototype.hasOwnProperty.call(el, name)) {
      continue;
    }
    const value = el[name];
    delete el[name];
    el[name] = value;
  }
}
var quiet = /* @__PURE__ */ new Set;
function restoreQuietly(el, state, mode) {
  quiet.add(el);
  try {
    return formCallback(el, "restore", state, mode);
  } finally {
    quiet.delete(el);
  }
}
var pendingRestores = /* @__PURE__ */ new Map;
function wroteFromScript(el) {
  for (const waiting of pendingRestores.keys()) {
    if (waiting.contains(el)) {
      pendingRestores.delete(waiting);
    }
  }
}
function restoreOnceBound(el, state, mode) {
  const token = {};
  pendingRestores.set(el, token);
  queueMicrotask(() => {
    if (pendingRestores.get(el) !== token) {
      return;
    }
    pendingRestores.delete(el);
    restoreQuietly(el, state, mode);
  });
}
function quietNow(el) {
  const owner = partOwners.get(el);
  if (quiet.has(el) || !!owner && quiet.has(owner)) {
    return true;
  }
  for (const inside of quiet) {
    if (el.contains(inside)) {
      return true;
    }
  }
  return false;
}
function detailsOnly(value, details) {
  return details === undefined && !!value && typeof value === "object" && "reason" in value && !(typeof Event !== "undefined" && value instanceof Event);
}
function withEvents(el, target, silent = [], actions = [], names = {}) {
  return new Proxy(target, {
    get(target2, key) {
      if (key in target2 || typeof key !== "string" || !/^on[A-Z]/.test(key)) {
        return target2[key];
      }
      if (silent.includes(key)) {
        return;
      }
      return (value, details) => {
        if (quietNow(el)) {
          return;
        }
        const only = detailsOnly(value, details);
        const { cancel, canceled, ...rest } = (only ? value : details) ?? {};
        const detail = only ? rest : { ...rest, value };
        const wait = actions.includes(key) ? waitList() : undefined;
        if (wait) {
          detail.waitUntil = wait.waitUntil;
        }
        const event = new CustomEvent(names[key] ?? key.slice(2).toLowerCase(), {
          detail,
          bubbles: false,
          cancelable: typeof cancel === "function" || typeof value?.preventDefault === "function",
          composed: true
        });
        const proceed = el.dispatchEvent(event);
        const waiting = wait?.done() ?? [];
        if (!proceed) {
          if (typeof cancel === "function") {
            cancel();
          } else if (value && typeof value.preventDefault === "function") {
            value.preventDefault();
          }
        }
        return waiting.length > 1 ? Promise.all(waiting).then((values) => values.at(-1)) : waiting[0];
      };
    }
  });
}
var instances = /* @__PURE__ */ new WeakMap;
function instanceOf(el) {
  return el ? instances.get(el) : undefined;
}
var reads = /^(?:get|is|can)[A-Z]|^focus$/;
function controllerView(el, api, methods) {
  const view = {};
  for (const name of methods) {
    const method = api[name];
    if (typeof method === "function") {
      view[name] = (...args) => {
        if (!reads.test(name)) {
          wroteFromScript(el);
        }
        return method.apply(api, args);
      };
    }
  }
  return Object.freeze(view);
}
var display = /* @__PURE__ */ new Map;
var aligned = /* @__PURE__ */ new Set;
var styleId;
function documentStyle() {
  if (styleId) {
    return styleId;
  }
  const copies = globalThis;
  const key = /* @__PURE__ */ Symbol.for("ui-sdk.web-styles@1");
  copies[key] = (copies[key] ?? 0) + 1;
  return styleId = `ui-sdk-web-${copies[key]}`;
}
var css = "";
var rulesVersion = 0;
var constructed = /* @__PURE__ */ new WeakMap;
function setDisplay(selector, value, align = false) {
  if (align) {
    aligned.add(selector);
  }
  if (!value && !align) {
    return;
  }
  if (value) {
    display.set(selector, value);
  }
  css = rules();
  writeStyle(document, documentStyle(), css);
  rulesVersion++;
}
function rules() {
  return [
    "@layer ui-sdk {",
    '  :where([data-slot][hidden]:not([hidden="until-found"])) { display: none !important }',
    ...[...display].map(([selector, value]) => `  :where(${selector}:not([hidden]), ${selector}[hidden="until-found"]) { display: ${value} }`),
    ...[...aligned].map((tag) => `  :where(${tag}[align]) { text-align: inherit }`),
    "  :where([as-child]) { display: contents }",
    "}"
  ].join(`
`);
}
function adoptStyles(el) {
  const root = el.getRootNode();
  if (!isShadowRoot(root)) {
    return copyStyles(el.ownerDocument);
  }
  const shared = sharedSheet(root.ownerDocument);
  if (!shared || root.adoptedStyleSheets.includes(shared)) {
    return;
  }
  root.adoptedStyleSheets = [shared, ...root.adoptedStyleSheets];
}
var isShadowRoot = (node) => node.nodeType === 11 && ("host" in node);
function sharedSheet(doc) {
  const view = doc.defaultView;
  if (!view) {
    return;
  }
  let entry = constructed.get(doc);
  if (!entry) {
    constructed.set(doc, entry = { sheet: new view.CSSStyleSheet, version: -1 });
  }
  if (entry.version !== rulesVersion) {
    entry.sheet.replaceSync(rules());
    entry.version = rulesVersion;
  }
  return entry.sheet;
}
function copyStyles(doc) {
  if (css) {
    writeStyle(doc, documentStyle(), css);
  }
}
var dependents = /* @__PURE__ */ new Set;
function reconfigureInside(el) {
  for (const dependent of dependents) {
    if (dependent !== el && el.contains(dependent)) {
      dependent.reconfigure();
    }
  }
}
var portals = /* @__PURE__ */ new WeakMap;
var partOwners = /* @__PURE__ */ new WeakMap;
var slotParts = /* @__PURE__ */ new WeakMap;
function innerPart(part, owner) {
  for (let node = part.el;node && node !== owner; node = node.parentElement) {
    const other = slotParts.get(node);
    if (other === part) {
      return;
    }
    if (other?.el === part.el && registered.has(other)) {
      return other;
    }
  }
}
function handOver(part) {
  part.dataSlot = undefined;
  const sharing = [];
  for (let node = part.el;node; node = node.parentElement) {
    const other = slotParts.get(node);
    if (other && other !== part && other.el === part.el && registered.has(other)) {
      sharing.push(other);
    }
  }
  if (!sharing.length) {
    return;
  }
  part.el.removeAttribute("data-slot");
  markAuthored(part.el, "data-slot");
  for (const other of sharing) {
    other.sync?.();
  }
}
var registered = /* @__PURE__ */ new WeakSet;
var findOwnerAgain = /* @__PURE__ */ new WeakMap;
var hasRichValue = (props) => props.value !== undefined && typeof props.value !== "string";
function propsAround(el, slot, owner) {
  for (let node = el.parentElement;node; node = node.parentElement) {
    const part = slotParts.get(node);
    if (part?.slot !== slot || partOwners.get(node) !== owner) {
      continue;
    }
    return part.keyed && hasRichValue(part.props) ? { ...part.props, value: part.props.id } : part.props;
  }
}
function findOwner(el, selector) {
  const target = el.getAttribute("for");
  if (target) {
    const root = el.getRootNode();
    const owner = "getElementById" in root ? root.getElementById(target) : null;
    if (owner?.matches(selector)) {
      return owner;
    }
  }
  for (let node = el.parentElement;node; node = node.parentElement) {
    if (node.matches(selector)) {
      return node;
    }
    const owner = partOwners.get(node);
    if (owner?.matches(selector)) {
      return owner;
    }
  }
}
function whenGone(el, run) {
  queueMicrotask(() => {
    if (!el.isConnected) {
      run();
    }
  });
}
var formStates = /* @__PURE__ */ new WeakMap;
var bindInternals = (el, internals, options) => {
  formStates.set(el, options.state);
  return bindElementInternals(el, internals, options);
};
function formAssociated(Base) {
  return class extends Base {
    static formAssociated = true;
    #internals;
    constructor() {
      super();
      this.#internals = this.attachInternals();
      attachFormInternals(this, this.#internals, bindInternals);
    }
    get form() {
      return this.#internals.form;
    }
    get labels() {
      return this.#internals.labels;
    }
    get name() {
      return this.getAttribute("name") ?? "";
    }
    set name(value) {
      this.setAttribute("name", value);
    }
    get validity() {
      return this.#internals.validity;
    }
    get validationMessage() {
      return this.#internals.validationMessage;
    }
    get willValidate() {
      return this.#internals.willValidate;
    }
    checkValidity() {
      return this.#internals.checkValidity();
    }
    reportValidity() {
      return this.#internals.reportValidity();
    }
    setCustomValidity(message) {
      if (!formCallback(this, "customValidity", message)) {
        this.#internals.setValidity(message ? { customError: true } : {}, message);
      }
    }
    formResetCallback() {
      pendingRestores.delete(this);
      formCallback(this, "reset");
    }
    formDisabledCallback(disabled) {
      formCallback(this, "disabled", disabled);
    }
    formStateRestoreCallback(state, mode) {
      pendingRestores.delete(this);
      if (!restoreQuietly(this, state, mode)) {
        restoreOnceBound(this, state, mode);
      }
    }
  };
}
var defaultOf = (name) => `default${name[0].toUpperCase()}${name.slice(1)}`;
function defineRootElement(tagName, primitive, config) {
  if (!claimTag(tagName)) {
    return;
  }
  setDisplay(tagName, config.display);
  const schema = {
    debug: "boolean",
    ...config.attributes
  };
  const state = config.state ?? {};
  const optionsOf = (el, properties, rendered) => {
    const options = readAttributes(el, schema);
    for (const name of rendered) {
      delete options[name];
    }
    for (const [name, value] of Object.entries(properties)) {
      if (value !== undefined) {
        options[name] = value;
      }
    }
    for (const name of Object.keys(state)) {
      if (!(name in options)) {
        continue;
      }
      const fallback = defaultOf(name);
      if (!(fallback in options)) {
        options[fallback] = options[name];
      }
      delete options[name];
    }
    return { ...options, ...config.options?.(el) };
  };
  customElements.define(tagName, class Owner extends (config.formAssociated ? formAssociated(HTMLElement) : HTMLElement) {
    static observedAttributes = [
      ...Object.keys(schema).map(kebab),
      ...semantics
    ];
    #view;
    get #instance() {
      return instances.get(this);
    }
    get api() {
      if (!this.#instance) {
        return;
      }
      return this.#view ??= controllerView(this, this.#instance.api, config.api ?? []);
    }
    #parts = /* @__PURE__ */ new Set;
    #pending = /* @__PURE__ */ new Set;
    #connected = false;
    #rendering = false;
    #rendered = /* @__PURE__ */ new Set;
    #applying = /* @__PURE__ */ new Set;
    #stale = /* @__PURE__ */ new Set;
    #gone = false;
    #properties = {};
    #state = {};
    #saved;
    static {
      for (const [name, { get, set }] of Object.entries(state)) {
        Object.defineProperty(Owner.prototype, name, {
          get() {
            if (name in this.#state) {
              return this.#state[name];
            }
            return this.#instance ? get(this.#instance.api) : undefined;
          },
          set(value) {
            wroteFromScript(this);
            if (this.#instance && !this.#gone) {
              this.#quietly(() => set(this.#instance.api, value));
            } else {
              this.#state[name] = value;
            }
          }
        });
      }
      for (const name of config.properties ?? []) {
        Object.defineProperty(Owner.prototype, name, {
          get() {
            return this.#properties[name];
          },
          set(value) {
            if (Object.is(this.#properties[name], value)) {
              return;
            }
            this.#properties[name] = value;
            if (!this.#connected) {
              return;
            }
            this.#configure();
            this.#render();
          }
        });
      }
      reflectAttributes(Owner.prototype, schema, config.defaults);
    }
    #configure(defaults) {
      this.#instance?.setOptions(withEvents(this, {
        ...optionsOf(this, this.#properties, this.#rendered),
        ...defaults,
        id: this.#instance.id
      }, config.silent, config.actions, config.events));
    }
    attributeChangedCallback(name, previous, value) {
      markAuthored(this, name);
      if (semantics.includes(name)) {
        return;
      }
      const key = name.replace(/-(\w)/g, (_, char) => char.toUpperCase());
      if (key in state && value !== previous && !this.#rendering) {
        wroteFromScript(this);
      }
      if (!this.#rendering || value === null) {
        this.#rendered.delete(key);
      } else if (previous === null) {
        this.#rendered.add(key);
      }
      if (!this.#connected) {
        return;
      }
      this.#configure();
      reconfigureInside(this);
      if (!(key in state) || value === previous) {
        return;
      }
      const type = schema[key];
      const cleared = type === "boolean" ? false : type === "list" ? [] : null;
      this.#quietly(() => state[key].set(this.#instance.api, value === null ? cleared : parseAttribute(type, value)));
    }
    #quietly(write) {
      const nested = quiet.has(this);
      quiet.add(this);
      try {
        writeFromScript(this, write);
      } finally {
        if (!nested) {
          quiet.delete(this);
          validityChanged(this);
        }
      }
    }
    connectedCallback() {
      adoptStyles(this);
      if (this.#connected) {
        for (const part of this.#parts) {
          elementMoved(part.el);
        }
        if (config.options) {
          this.#configure();
        }
        return;
      }
      upgradeProperties(this, [
        ...Object.keys(state),
        ...config.properties ?? [],
        ...Object.keys(schema)
      ]);
      for (const [name, value] of Object.entries(config.host ?? {})) {
        if (!this.hasAttribute(name)) {
          this.setAttribute(name, value);
        }
      }
      const restore = this.#gone && !Object.keys(this.#state).length ? this.#saved : undefined;
      const starts = {};
      if (this.#gone && restore === undefined) {
        for (const [name, { get }] of Object.entries(state)) {
          starts[name] = get(this.#instance.api);
        }
      }
      Object.assign(starts, this.#state);
      this.#state = {};
      const last = Object.fromEntries(Object.entries(starts).map(([name, value]) => [
        defaultOf(name),
        value
      ]));
      if (this.#gone) {
        instances.delete(this);
        this.#view = undefined;
        this.#gone = false;
        this.#saved = undefined;
      }
      let instance = this.#instance;
      if (instance) {
        this.#configure();
      } else {
        instance = primitive(withEvents(this, {
          ...optionsOf(this, this.#properties, this.#rendered),
          ...last,
          id: this.id || `ui-sdk-${tagName.replace(/^ui-/, "")}-${++count}`
        }, config.silent, config.actions, config.events));
        instances.set(this, instance);
      }
      if (config.formAssociated && Object.keys(starts).length) {
        const base = instance.startState(optionsOf(this, this.#properties, this.#rendered));
        this.#configure(Object.fromEntries(Object.keys(starts).map((name) => [defaultOf(name), base[name]])));
      }
      this.#connected = true;
      if (config.options) {
        dependents.add(this);
      }
      if (config.self) {
        const el = boundElement(this, config.target);
        if (el) {
          this.#registerSelf(el);
        } else {
          warn(`<${tagName}> needs an element inside it.`);
        }
      }
      for (const [slot, find] of Object.entries(config.children ?? {})) {
        const child = find(this);
        if (child) {
          this.#registerChild(slot, child);
        } else if (!config.optionalChildren?.includes(slot)) {
          warn(`<${tagName}> needs its native element inside it for "${slot}".`);
        }
      }
      if (config.children || config.target) {
        this.#childObserver = new MutationObserver(() => {
          this.#syncChildren();
          this.#syncSelf();
        });
        this.#childObserver.observe(this, { childList: true });
      }
      this.#render();
      if (this.id) {
        const root = this.getRootNode();
        for (const el of root.querySelectorAll(`[for="${CSS.escape(this.id)}"]`)) {
          findOwnerAgain.get(el)?.();
        }
      }
      if (restore !== undefined) {
        restoreOnceBound(this, restore, "restore");
      }
    }
    #renderCleanup;
    #render() {
      this.#renderCleanup?.();
      this.#renderCleanup = config.render?.(this, this.#instance) || undefined;
    }
    reconfigure() {
      if (this.#connected) {
        this.#configure();
      }
    }
    #childParts = /* @__PURE__ */ new Map;
    #childObserver;
    #selfPart;
    #registerSelf(el) {
      this.#selfPart = { slot: config.self, el, props: {} };
      this.register(this.#selfPart);
    }
    #syncSelf() {
      if (!config.self || !config.target) {
        return;
      }
      const el = boundElement(this, config.target);
      if (el === this.#selfPart?.el) {
        return;
      }
      if (this.#selfPart) {
        this.unregister(this.#selfPart);
      }
      this.#selfPart = undefined;
      this.#configure();
      if (el) {
        this.#registerSelf(el);
      }
    }
    #registerChild(slot, el) {
      const part = {
        slot,
        el,
        props: config.childProps?.read?.(el) ?? {}
      };
      if (config.childProps) {
        part.observer = new MutationObserver(() => {
          part.props = config.childProps.read?.(el) ?? {};
          this.#configure();
          this.update(part, false);
        });
        part.observer.observe(el, {
          attributeFilter: config.childProps.attributes
        });
      }
      this.#childParts.set(slot, part);
      this.register(part);
    }
    #syncChildren() {
      for (const [slot, find] of Object.entries(config.children ?? {})) {
        const child = find(this);
        const current = this.#childParts.get(slot);
        if (current?.el === child) {
          continue;
        }
        if (current) {
          this.unregister(current);
          this.#childParts.delete(slot);
        }
        if (child) {
          this.#registerChild(slot, child);
        }
      }
    }
    disconnectedCallback() {
      whenGone(this, () => {
        this.#saved = formStates.get(this)?.();
        this.#renderCleanup?.();
        this.#renderCleanup = undefined;
        this.#childObserver?.disconnect();
        this.#childObserver = undefined;
        this.#childParts.clear();
        this.#selfPart = undefined;
        this.#connected = false;
        dependents.delete(this);
        for (const part of this.#parts) {
          this.unregister(part);
        }
        this.#instance?.destroy();
        this.#gone = true;
      });
    }
    register(part) {
      this.#parts.add(part);
      registered.add(part);
      part.sync = () => this.#pending.has(part) || this.#sync(part);
      if (!this.#pending.size) {
        queueMicrotask(() => this.#flush());
      }
      this.#pending.add(part);
    }
    #flush() {
      const parts = inDocumentOrder([...this.#pending]);
      this.#pending.clear();
      for (const part of parts) {
        if (!this.#parts.has(part)) {
          continue;
        }
        if (part.reread) {
          part.props = part.reread();
        }
        if (part.feature) {
          this.#instance.use(part.feature);
        }
        this.#watch(part);
        this.#sync(part);
      }
    }
    #watch(part) {
      const instance = this.#instance;
      part.unwatch?.();
      const record = instance.part(part.slot, part.props);
      part.record = record;
      part.selected = selectedKeys(record);
      part.version = renderVersion(instance);
      part.unwatch = subscribe(record, (liveOnly) => {
        if (present(record) !== part.shown) {
          part.version = renderVersion(instance);
          return this.#sync(part);
        }
        if (liveOnly) {
          return;
        }
        const version = renderVersion(instance);
        if (version === part.version) {
          return;
        }
        part.version = version;
        this.#sync(part);
      });
    }
    unregister(part) {
      part.unwatch?.();
      part.unwatch = undefined;
      part.observer?.disconnect();
      part.observer = undefined;
      this.#unbind(part);
      releaseAttrs(part.el, this.#channel);
      part.disconnect?.();
      part.disconnect = undefined;
      this.#restore(part);
      this.#parts.delete(part);
      registered.delete(part);
      this.#pending.delete(part);
      handOver(part);
    }
    rebind() {
      const parts = inDocumentOrder([...this.#parts].filter((part) => !this.#pending.has(part)));
      for (const part of parts) {
        this.#unbind(part);
      }
      for (const part of parts) {
        this.#sync(part);
      }
    }
    update(part, rebind) {
      if (this.#pending.has(part)) {
        return;
      }
      this.#rewatch(part, rebind);
      this.#sync(part);
      for (const other of this.#parts) {
        if (other === part || this.#pending.has(other)) {
          continue;
        }
        if (other.reread) {
          const previous = other.props;
          other.props = other.reread();
          this.#rewatch(other, rekeyed(previous, other.props));
        }
        this.#sync(other);
      }
      reconfigureInside(part.el);
    }
    #rewatch(part, rebind) {
      if (rebind) {
        this.#unbind(part);
      }
      const record = this.#instance.part(part.slot, part.props);
      if (record !== part.record || selectedKeys(record) !== part.selected) {
        this.#watch(part);
      }
    }
    #sync(part) {
      if (this.#applying.has(part)) {
        return void this.#stale.add(part);
      }
      adoptStyles(part.el);
      const instance = this.#instance;
      const record = instance.part(part.slot, part.props);
      part.disconnect ??= connect(record, part.el);
      part.shown = present(record);
      if (part.shown) {
        const target = this.#portalTarget(part);
        if (target !== undefined && this.#moves(part, target)) {
          this.#unbind(part);
          this.#move(part, target);
        }
        const attrs2 = attrs(record);
        if (attrs2.hidden === undefined && (conditional(record) || ("hidden" in attrs2))) {
          part.el.removeAttribute("hidden");
        }
        this.#apply(part, attrs2);
        if (!part.unbind) {
          this.#bind(part, record);
        }
      } else {
        if (part.unbind) {
          this.#apply(part, attrs(record));
          this.#unbind(part);
        }
        if (!part.el.hasAttribute("hidden")) {
          part.el.setAttribute("hidden", "");
        }
        const slot = attrs(record)["data-slot"];
        if (slot && !part.el.hasAttribute("data-slot")) {
          part.el.setAttribute("data-slot", slot);
        }
        this.#restore(part);
      }
    }
    #bind(part, record) {
      let cleanup;
      let unbound = false;
      part.unbind = () => {
        unbound = true;
        cleanup?.();
      };
      cleanup = bind(record, part.el);
      if (unbound) {
        cleanup();
      }
    }
    #unbind(part) {
      const unbind = part.unbind;
      part.unbind = undefined;
      unbind?.();
    }
    #portalTarget(part) {
      if (!config.portal?.slots.includes(part.slot)) {
        return;
      }
      return portalTarget(config.portal.container(this, part));
    }
    #moves(part, target) {
      return target ? part.el.parentNode !== target : !!part.placeholder;
    }
    #move(part, target) {
      this.#restore(part);
      if (!target) {
        return;
      }
      part.placeholder = document.createComment(`${tagName} ${part.slot}`);
      part.el.replaceWith(part.placeholder);
      target.appendChild(part.el);
      portals.set(part.el, target);
    }
    #apply(part, attrs) {
      const inner = innerPart(part, this);
      if (inner?.dataSlot) {
        attrs = { ...attrs, "data-slot": inner.dataSlot };
      }
      part.dataSlot = attrs["data-slot"];
      const rendering = this.#rendering;
      this.#rendering = part.el === this;
      this.#applying.add(part);
      try {
        applyAttrs(part.el, attrs, this.#channel);
      } finally {
        this.#rendering = rendering;
        this.#applying.delete(part);
      }
      if (this.#stale.delete(part)) {
        this.#sync(part);
      }
    }
    get #channel() {
      return `render:${autoId(this)}`;
    }
    #restore(part) {
      if (!part.placeholder) {
        return;
      }
      part.placeholder.replaceWith(part.el);
      part.placeholder = undefined;
      portals.delete(part.el);
    }
  });
}
function definePartElement(tagName, config) {
  if (!claimTag(tagName)) {
    return;
  }
  const schema = config.props ?? {};
  setDisplay(tagName, config.display, "align" in schema);
  customElements.define(tagName, class PartElement extends (config.formAssociated ? formAssociated(HTMLElement) : HTMLElement) {
    static observedAttributes = [
      ...Object.keys(schema).map(kebab),
      "for",
      ...semantics
    ];
    #owner;
    #part;
    #properties = {};
    constructor() {
      super();
      findOwnerAgain.set(this, () => {
        if (this.isConnected) {
          this.connectedCallback();
        }
      });
    }
    static {
      for (const name of config.properties ?? []) {
        Object.defineProperty(PartElement.prototype, name, {
          get() {
            return this.#properties[name] ?? (schema[name] && readAttribute(this, name, schema[name]));
          },
          set(value) {
            this.#properties[name] = value;
            this.attributeChangedCallback("");
          }
        });
      }
      reflectAttributes(PartElement.prototype, schema, config.defaults);
    }
    #props() {
      const props = {
        ...config.context?.(this),
        ...readAttributes(this, schema)
      };
      for (const name of config.properties ?? []) {
        if (this.#properties[name] !== undefined) {
          props[name] = this.#properties[name];
        }
      }
      for (const [name, { slot, prop }] of Object.entries(config.from ?? {})) {
        props[name] ??= propsAround(this, slot, this.#owner)?.[prop];
      }
      for (const name of config.ids ?? []) {
        props[name] ??= autoId(this);
      }
      if (props.value === undefined && props.id === undefined) {
        props.id = autoId(this);
      }
      if (config.keyed && hasRichValue(props)) {
        props.id ??= instanceOf(this.#owner)?.api.internal.keyOf(props.value);
      }
      return withEvents(this, props, [], config.actions);
    }
    #children;
    connectedCallback() {
      upgradeProperties(this, [
        ...config.properties ?? [],
        ...Object.keys(schema)
      ]);
      adoptStyles(this);
      if ((config.target || this.hasAttribute("as-child")) && !this.#children) {
        this.#children = new MutationObserver(() => this.#retarget());
        this.#children.observe(this, { childList: true });
      }
      const owner = findOwner(this, config.owner) ?? this.#owner;
      if (!owner) {
        return queueMicrotask(() => this.#findOwnerLater());
      }
      if (!("register" in owner)) {
        customElements.whenDefined(owner.localName).then(() => this.isConnected && this.connectedCallback());
        return;
      }
      if (owner === this.#owner && this.#part && registered.has(this.#part)) {
        return;
      }
      if (this.#owner && this.#part) {
        this.#owner.unregister(this.#part);
      }
      const el = boundElement(this, config.target);
      if (!el) {
        return queueMicrotask(() => {
          if (this.isConnected && !this.#part && !boundElement(this, config.target)) {
            warn(`<${tagName}> needs an element inside it.`);
          }
        });
      }
      if (!this.#part) {
        config.render?.(this);
        if (this.#part) {
          return;
        }
      }
      this.#owner = owner;
      this.#part = {
        slot: config.slot,
        feature: config.feature,
        el,
        props: this.#props(),
        reread: (config.context || config.from) && (() => this.#props()),
        keyed: config.keyed
      };
      partOwners.set(this, owner);
      slotParts.set(this, this.#part);
      owner.register(this.#part);
    }
    #findOwnerLater() {
      if (!this.isConnected || this.#owner) {
        return;
      }
      if (findOwner(this, config.owner)) {
        this.connectedCallback();
      } else if (config.alone) {
        config.alone(boundElement(this, config.target) ?? this, this);
      } else if (!this.hasAttribute("for")) {
        warn(`<${tagName}> must be inside ${config.owner}.`);
      }
    }
    #retarget() {
      const old = this.#part?.el;
      if (!this.isConnected || old && portals.has(old)) {
        return;
      }
      const el = boundElement(this, config.target);
      if (el === (old ?? null)) {
        return;
      }
      if (this.#owner && this.#part) {
        this.#owner.unregister(this.#part);
      }
      this.#owner = undefined;
      this.#part = undefined;
      if (el) {
        this.connectedCallback();
      }
    }
    disconnectedCallback() {
      whenGone(this, () => {
        this.#children?.disconnect();
        this.#children = undefined;
        if (this.#owner && this.#part) {
          this.#owner.unregister(this.#part);
        }
        partOwners.delete(this);
        slotParts.delete(this);
        this.#owner = undefined;
        this.#part = undefined;
      });
    }
    attributeChangedCallback(name) {
      markAuthored(this, name);
      if (semantics.includes(name)) {
        return;
      }
      if (name === "for") {
        if (!this.isConnected) {
          return;
        }
        if (!findOwner(this, config.owner) && this.#owner && this.#part) {
          this.#owner.unregister(this.#part);
          this.#owner = undefined;
          partOwners.delete(this);
        }
        this.connectedCallback();
        return;
      }
      if (!this.#owner || !this.#part) {
        if (config.alone && this.isConnected && !findOwner(this, config.owner)) {
          config.alone(boundElement(this, config.target) ?? this, this);
        }
        return;
      }
      const previous = this.#part.props;
      this.#part.props = this.#props();
      const next = this.#part.props;
      const rebind = rekeyed(previous, next) || !!config.rebind?.some((name2) => previous[name2] !== next[name2]);
      this.#owner.update(this.#part, rebind);
      config.changed?.(this);
    }
  });
}
var rootTags = /* @__PURE__ */ new WeakMap;
function elementProps(props, schema, kinds = {}) {
  const attributes = {};
  const properties = [];
  const ids = [];
  const actions = [];
  let keyed = false;
  const from = {};
  for (const [name, spec] of Object.entries({ ...props, ...kinds })) {
    if (!spec) {
      continue;
    }
    if (typeof spec === "object") {
      const [slot, prop = name] = spec.from.split(".");
      if (slot in schema.slots) {
        from[name] = { slot, prop };
      }
      if (!(name in kinds)) {
        continue;
      }
    }
    const kind = typeof spec === "object" ? spec.kind : spec;
    if (kind === "value") {
      properties.push(name);
    } else if (kind === "action") {
      actions.push(name);
    } else if (kind === "id") {
      ids.push(name);
    } else if (kind === "key") {
      keyed = true;
    }
    if (kind === "value" || kind === "action" || kind === "callback") {
      continue;
    }
    if (name !== "id" || name in kinds) {
      attributes[name] = kind === "id" || kind === "key" ? "string" : kind;
    }
  }
  return {
    attributes,
    properties,
    ids,
    actions,
    keyed,
    from: Object.keys(from).length ? from : undefined
  };
}
var tagOf = (tagOrOptions) => typeof tagOrOptions === "string" ? { tag: tagOrOptions } : tagOrOptions;
function partElement(primitive, key, tagOrOptions, root) {
  const schema = schemaOf(primitive);
  if (key === "root") {
    const {
      tag: tag2,
      self,
      kinds: kinds2,
      properties: properties2 = [],
      ...options2
    } = tagOf(tagOrOptions);
    rootTags.set(primitive, [
      .../* @__PURE__ */ new Set([...rootTags.get(primitive) ?? [], tag2])
    ]);
    const { debug: _debug, ...optionSchema } = schema.options;
    const props2 = elementProps(optionSchema, schema, kinds2);
    const config2 = {
      ...options2,
      self: self ?? ("root" in schema.slots && !options2.children?.root ? "root" : undefined),
      attributes: props2.attributes,
      properties: [.../* @__PURE__ */ new Set([...props2.properties, ...properties2])].filter((name) => !options2.state?.[name]),
      actions: props2.actions
    };
    return { kind: "owner", key, tagName: tag2, config: config2 };
  }
  const {
    tag,
    slot = key,
    owners = [],
    kinds,
    properties = [],
    ...options
  } = tagOf(tagOrOptions);
  const roots = rootTags.get(primitive);
  if (!roots) {
    throw new Error(`<${tag}> is a part of ${primitive.name}: define its root first.`);
  }
  const slotSchema = schema.slots[slot] ?? (options.feature?.slots[slot] && (options.feature.slots[slot].props ?? {}));
  if (!slotSchema) {
    throw new Error(`<${tag}>: ${primitive.name} has no ${slot} slot.`);
  }
  const { attributes, ...props } = elementProps(slotSchema, schema, kinds);
  const config = {
    ...options,
    slot,
    owner: [.../* @__PURE__ */ new Set([...root ? [root] : [], ...roots, ...owners])].join(", "),
    props: attributes,
    ...props,
    properties: [.../* @__PURE__ */ new Set([...props.properties, ...properties])]
  };
  return { kind: "part", key, tagName: tag, config };
}
function partElements(primitive, tags) {
  const { root, ...parts } = tags;
  const owner = partElement(primitive, "root", root);
  return [
    owner,
    ...Object.entries(parts).flatMap(([key, tag]) => tag ? [partElement(primitive, key, tag, owner.tagName)] : [])
  ];
}
function defineElement(primitive, element) {
  if (element.kind === "owner") {
    defineRootElement(element.tagName, primitive, element.config);
  } else {
    definePartElement(element.tagName, element.config);
  }
}
var pascal = (name) => name.replace(/(^|-)(\w)/g, (_, _dash, char) => char.toUpperCase());
function createParts(primitive, tags) {
  const parts = {};
  for (const element of partElements(primitive, tags)) {
    defineElement(primitive, element);
    parts[pascal(element.key)] = typeof customElements === "undefined" ? undefined : customElements.get(element.tagName);
  }
  return parts;
}

// ../../node_modules/.bun/@ui-sdk+web@0.1.0-beta.6+28ce4433b2aaddba/node_modules/@ui-sdk/web/dist/button.js
var authoredTypes = /* @__PURE__ */ new WeakMap;
var isButtonType = (type) => type === "button" || type === "submit" || type === "reset";
function authoredType(el) {
  const inner = wrappedButton(el);
  if (!inner) {
    return;
  }
  const current = inner.getAttribute("type");
  const authored = authoredTypes.get(inner);
  const written = isButtonType(authored) ? authored : "button";
  if (!authoredTypes.has(inner) || current !== written) {
    authoredTypes.set(inner, current);
  }
  const type = authoredTypes.get(inner);
  return isButtonType(type) ? type : undefined;
}
function defineButtonElements() {
  createParts(button, {
    root: {
      tag: "ui-button",
      target: wrappedButton,
      display: "contents",
      kinds: { type: null },
      options: (el) => ({ type: authoredType(el), action: actionOf(el) })
    }
  });
}

// ../../node_modules/.bun/@ui-sdk+web@0.1.0-beta.6+28ce4433b2aaddba/node_modules/@ui-sdk/web/dist/entries/button.js
defineButtonElements();

// src/main.ts
var variants = ["primary", "secondary", "danger", "ghost", "outline"];
var releasePending = null;
window.__releasePending = () => {
  releasePending?.();
  releasePending = null;
};
var heldPromise = () => new Promise((resolve) => {
  releasePending = resolve;
});
function uiButton({
  variant,
  size,
  iconOnly,
  disabled,
  label,
  holdsPending,
  id
}) {
  const wrapper = document.createElement("ui-button");
  if (disabled)
    wrapper.setAttribute("disabled", "");
  wrapper.setAttribute("pending-announcement", "Saving changes");
  const button = document.createElement("button");
  button.className = "hashti-button";
  if (variant)
    button.setAttribute("data-variant", variant);
  button.setAttribute("data-size", size ?? "lg");
  if (!size)
    button.setAttribute("data-hashti-size-default", "");
  if (iconOnly)
    button.setAttribute("data-icon-only", "");
  if (id)
    button.id = id;
  if (iconOnly) {
    button.setAttribute("aria-label", "Copy workspace link");
    button.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M10 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5zM9 2l4 4H9z"/></svg>`;
  } else {
    button.textContent = label ?? "Save changes";
  }
  wrapper.appendChild(button);
  wrapper.addEventListener("action", (event) => {
    const detail = event.detail;
    const spinner = document.createElement("span");
    spinner.className = "hashti-spinner";
    spinner.setAttribute("aria-hidden", "true");
    requestAnimationFrame(() => {
      if (button.hasAttribute("data-pending") && !spinner.isConnected)
        button.appendChild(spinner);
    });
    const cleanup = () => spinner.remove();
    if (holdsPending) {
      detail.waitUntil(heldPromise().finally(cleanup));
    } else {
      detail.waitUntil(new Promise((resolve) => setTimeout(resolve, 1200)).finally(cleanup));
    }
  });
  return wrapper;
}
var variantsGrid = document.getElementById("variants");
for (const variant of variants) {
  variantsGrid.appendChild(uiButton({
    variant,
    label: variant === "danger" ? "Delete draft" : "Save changes"
  }));
}
var sizesGrid = document.getElementById("sizes");
for (const size of ["sm", "md", "lg"]) {
  sizesGrid.appendChild(uiButton({ variant: "primary", size }));
}
sizesGrid.appendChild(uiButton({ variant: "secondary", size: "md" }));
var statesGrid = document.getElementById("states");
statesGrid.appendChild(uiButton({ variant: "primary", id: "spike-hover", label: "Hover me" }));
statesGrid.appendChild(uiButton({ variant: "primary", id: "spike-active", label: "Press me" }));
for (const variant of variants) {
  statesGrid.appendChild(uiButton({
    variant,
    disabled: true,
    label: variant === "danger" ? "Delete draft" : "Save changes"
  }));
}
statesGrid.appendChild(uiButton({
  variant: "primary",
  holdsPending: true,
  id: "spike-pending",
  label: "Save draft"
}));
statesGrid.appendChild(uiButton({ variant: "ghost", iconOnly: true }));
var fa = document.getElementById("rtl-fa");
fa.appendChild(uiButton({ variant: "primary", label: "ذخیرهٔ تغییرات تنظیمات فضای کاری" }));
var ar = document.getElementById("rtl-ar");
ar.appendChild(uiButton({ variant: "primary", label: "حفظ تغييرات إعدادات مساحة العمل" }));
document.body.setAttribute("data-spike", "ready");
