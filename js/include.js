const slots = [...document.querySelectorAll("[data-include]")];

const load = async (slot) => {
  const url = slot.getAttribute("data-include");
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} を読み込めませんでした (${response.status})`);
  }
  return response.text();
};

const insert = (slot, html) => {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
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
    const htmlList = await Promise.all(slots.map(load));
    const scripts = slots.flatMap((slot, index) => insert(slot, htmlList[index]));
    await runScripts(scripts);
  } catch (error) {
    console.error(error);
  } finally {
    markReady();
  }
})();
