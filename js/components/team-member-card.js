import { getTeamImage } from "../data/team-members.js";

export function createTeamMemberCard(member) {
  const card = document.createElement("div");
  card.className = "team-member-card";
  card.setAttribute("data-id", member.id);

  const imageUrl = getTeamImage(member);

  card.innerHTML = `
    <div class="member-image-container">
      <img 
        src="${imageUrl}" 
        alt="${member.name}" 
        class="member-image"
        loading="lazy"
        onerror="this.src='assets/image/placeholder.jpg'"
      >
      <div class="member-overlay"></div>
    </div>
    
    <div class="member-info">
      <h3 class="member-name">${member.name}</h3>
      <p class="member-role">${member.role}</p>
      <p class="member-description">${member.description}</p>
      
      <div class="member-expertise">
        ${member.expertise
          .map((skill) => `<span class="skill-tag">${skill}</span>`)
          .join("")}
      </div>
      
      <div class="member-social">
        ${
          member.social.instagram
            ? `<a href="https://instagram.com/${member.social.instagram.replace(
                "@",
                ""
              )}" 
            class="social-link" target="_blank" title="Instagram">
            <i class="fab fa-instagram"></i>
          </a>`
            : ""
        }
        ${
          member.social.email
            ? `<a href="mailto:${member.social.email}" class="social-link" title="Email">
            <i class="fas fa-envelope"></i>
          </a>`
            : ""
        }
      </div>
    </div>
  `;

  return card;
}
