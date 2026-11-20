const slots = [...document.querySelectorAll("[data-include]")];

const load = async (slot) => {
  const url = new URL(slot.getAttribute("data-include"), document.baseURI);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url.pathname} を読み込めませんでした (${response.status})`);
  }
  return { html: await response.text(), url };
};

const isRelativeAsset = (value) => {
  const path = value.trim();
  return path !== "" && !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(path);
};

const resolveAsset = (value, baseUrl) => {
  if (!isRelativeAsset(value)) return value;
  const resolved = new URL(value.trim(), baseUrl);
  return `${resolved.pathname}${resolved.search}${resolved.hash}`;
};

const resolveSrcset = (value, baseUrl) =>
  value
    .split(",")
    .map((part) => {
      const item = part.trim();
      if (!item) return item;
      const splitAt = item.search(/\s/);
      const path = splitAt === -1 ? item : item.slice(0, splitAt);
      const descriptor = splitAt === -1 ? "" : item.slice(splitAt);
      return resolveAsset(path, baseUrl) + descriptor;
    })
    .join(", ");

const rewriteAssets = (root, baseUrl) => {
  root.querySelectorAll("img[src], source[src], video[src], audio[src]").forEach((el) => {
    el.setAttribute("src", resolveAsset(el.getAttribute("src"), baseUrl));
  });
  root.querySelectorAll("[srcset]").forEach((el) => {
    el.setAttribute("srcset", resolveSrcset(el.getAttribute("srcset"), baseUrl));
  });
  root.querySelectorAll("[poster]").forEach((el) => {
    el.setAttribute("poster", resolveAsset(el.getAttribute("poster"), baseUrl));
  });
};

const insert = (slot, html, baseUrl) => {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  rewriteAssets(template.content, baseUrl);
  const scripts = [...template.content.querySelectorAll("script")];
  scripts.forEach((script) => script.remove());
  slot.replaceWith(template.content);
  return scripts;
};

const runScripts = async (scripts) => {
  for (const source of scripts) {
    const script = document.createElement("script");
    for (const attr of source.attributes) {
      script.setAttribute(attr.name, attr.value);
    }
    script.textContent = source.textContent;
    if (script.src) {
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () =>
          reject(new Error(`${script.src} を読み込めませんでした`));
        document.body.appendChild(script);
      });
    } else {
      document.body.appendChild(script);
    }
  }
};

const markReady = () => {
  window.__includesReady = true;
  document.dispatchEvent(new Event("includes:ready"));
};

(async () => {
  try {
    const includes = await Promise.all(slots.map(load));
    const scripts = slots.flatMap((slot, index) =>
      insert(slot, includes[index].html, includes[index].url)
    );
    await runScripts(scripts);
  } catch (error) {
    console.error(error);
  } finally {
    markReady();
  }
})();
