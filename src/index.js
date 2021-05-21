import "./index.css";
import "./paramCheck.js";

const hash = window.location.hash.substr(1);
const values = hash.split("&").reduce((result, item) => {
  const parts = item.split("=");
  result[parts[0]] = parts[1];
  return result;
}, {});

history.pushState(
  "",
  document.title,
  window.location.pathname + window.location.search
);

async function getUser() {
  const userData = await fetch("https://discord.com/api/v9/users/@me", {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      Authorization: `${values.token_type} ${values.access_token}`,
    },
  });
  const user = await userData.json();
  return user;
}

async function getGuilds(after = 0) {
  const guildData = await fetch(
    `https://discord.com/api/v9/users/@me/guilds?after=${after}`,
    {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: `${values.token_type} ${values.access_token}`,
      },
    }
  );
  const guilds = await guildData.json();
  if (guilds.length === 200) {
    guilds.concat(await getGuilds(guilds[199].id));
  }
  return guilds;
}

getUser().then((user) => {
  const avatar = document.getElementById("avatar");
  avatar.setAttribute(
    "src",
    `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=256`
  );
  avatar.setAttribute("alt", `${user.username}#${user.discriminator}'s Avatar`);

  const userH3 = document.getElementById("user");
  userH3.innerText = `Hello ${user.username}#${user.discriminator}`;

  getGuilds().then(({ length }) => {
    const count = document.getElementById("text-xl");
    count.innerText = `<h5 class="text-xl">You are in <b id="count">${length}</b> guilds</h5>`;
  });
});
