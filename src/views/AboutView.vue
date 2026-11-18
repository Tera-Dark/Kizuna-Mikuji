<template>
  <main class="about-view">
    <header class="about-hero">
      <div class="portrait">
        <img src="/images/avatar-256.webp" alt="缘结神" width="256" height="256" decoding="async" />
        <span class="portrait-seal">缘</span>
      </div>

      <div class="hero-copy">
        <p class="eyebrow">縁結神 · {{ deity.reading }}</p>
        <h1>{{ deity.name }}</h1>
        <p class="hero-title">{{ deity.title }}</p>
        <p class="hero-line">{{ introLines[0] }}</p>
      </div>

      <RouterLink to="/" class="back-home">
        <AppIcon name="arrowRight" :size="12" />
        回神社
      </RouterLink>
    </header>

    <figure class="about-banner">
      <img src="/images/illustration.webp" alt="缘结神与满天的红线" width="1200" height="675" loading="lazy" decoding="async" />
      <figcaption>红线不止一条。你看不见，本神明看得见。</figcaption>
    </figure>

    <div class="about-grid">
      <aside class="about-aside">
        <h2 class="aside-title">档案</h2>
        <dl class="basic-list">
          <div v-for="row in profile.basics" :key="row.label" class="basic-row">
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </div>
        </dl>

        <div class="trait-block">
          <span class="trait-label">喜欢</span>
          <div class="trait-chips">
            <span v-for="item in profile.likes" :key="item" class="chip">{{ item }}</span>
          </div>
        </div>
        <div class="trait-block">
          <span class="trait-label">讨厌</span>
          <div class="trait-chips">
            <span v-for="item in profile.dislikes" :key="item" class="chip muted">{{ item }}</span>
          </div>
        </div>
        <div class="trait-block">
          <span class="trait-label">拿手</span>
          <div class="trait-chips">
            <span v-for="item in profile.strengths" :key="item" class="chip">{{ item }}</span>
          </div>
        </div>
        <div class="trait-block">
          <span class="trait-label">不拿手</span>
          <div class="trait-chips">
            <span v-for="item in profile.weaknesses" :key="item" class="chip muted">{{ item }}</span>
          </div>
        </div>
      </aside>

      <div class="about-main">
        <section class="about-section">
          <header class="section-head">
            <span class="section-index">一</span>
            <h2>她是干什么的</h2>
            <span class="section-rule"></span>
          </header>
          <ol class="intro-list">
            <li v-for="(line, index) in introLines" :key="index">
              <span class="intro-index">{{ ['一', '二', '三'][index] }}</span>
              <p>{{ line }}</p>
            </li>
          </ol>
        </section>

        <section class="about-section">
          <header class="section-head">
            <span class="section-index">二</span>
            <h2>三段旧事</h2>
            <span class="section-rule"></span>
          </header>
          <article v-for="story in stories" :key="story.title" class="story">
            <h3>{{ story.title }}</h3>
            <p>{{ story.body }}</p>
          </article>
        </section>

        <section class="about-section">
          <header class="section-head">
            <span class="section-index">三</span>
            <h2>跟她有关的人</h2>
            <span class="section-rule"></span>
          </header>
          <ul class="relation-list">
            <li v-for="relation in relations" :key="relation.name">
              <span class="relation-name">{{ relation.name }}</span>
              <span class="relation-desc">{{ relation.desc }}</span>
            </li>
          </ul>
        </section>

        <section class="about-section">
          <header class="section-head">
            <span class="section-index">四</span>
            <h2>她说过的话</h2>
            <span class="section-rule"></span>
          </header>
          <blockquote v-for="quote in quotes.slice(0, 4)" :key="quote" class="quote">
            {{ quote }}
          </blockquote>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import AppIcon from '../components/icons/AppIcon.vue';
import { deity, introLines, profile, stories, relations, quotes } from '../constants/enmusubi';
</script>

<style scoped>
.about-view {
  position: relative;
  z-index: 1;
  width: min(1000px, calc(100% - 48px));
  margin: 0 auto;
  padding: 44px 0 0;
}

.about-hero {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr) auto;
  gap: 28px;
  align-items: end;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--c-line);
}

.portrait {
  position: relative;
  width: 112px;
  height: 112px;
}

.portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid var(--c-line-strong);
  filter: saturate(0.9);
}

.portrait-seal {
  position: absolute;
  right: 0;
  bottom: 2px;
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  background: var(--c-shu);
  color: #FFF8F1;
  font-family: var(--font-display);
  font-size: 14.5px;
}

.eyebrow {
  margin: 0 0 8px;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--c-ink-faint);
}

.hero-copy h1 {
  margin: 0 0 4px;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.4vw, 3.1rem);
  font-weight: 600;
  letter-spacing: 0.1em;
  line-height: 1.1;
}

.hero-title {
  margin: 0 0 10px;
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--c-shu);
}

.hero-line {
  max-width: 34em;
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--c-ink-soft);
  text-wrap: pretty;
}

.back-home {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 2px;
  color: var(--c-ink-faint);
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-decoration: none;
  border-bottom: 1px solid var(--c-line);
}

.back-home svg {
  transform: rotate(180deg);
}

.back-home:hover {
  color: var(--c-shu);
}

.about-banner {
  position: relative;
  height: 240px;
  margin: 26px 0 0;
  overflow: hidden;
  border: 1px solid var(--c-line);
  background: var(--c-paper-2);
}

.about-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 34%;
  filter: saturate(0.82) sepia(0.06);
}

.about-banner::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 28%,
    rgba(54, 39, 37, 0.26) 58%,
    rgba(54, 39, 37, 0.72) 100%
  );
  pointer-events: none;
}

.about-banner figcaption {
  position: absolute;
  left: 18px;
  bottom: 14px;
  z-index: 1;
  color: #FFF8F1;
  font-family: var(--font-display);
  font-size: 14.5px;
  letter-spacing: 0.12em;
  text-shadow: 0 1px 3px rgba(40, 22, 18, 0.5);
}

.about-grid {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 64px;
  align-items: start;
  padding-top: 36px;
}

.about-aside {
  position: sticky;
  top: 92px;
}

.aside-title {
  margin: 0 0 12px;
  font-family: var(--font-display);
  font-size: 16.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--c-ink);
}

.basic-list {
  margin: 0 0 22px;
}

.basic-row {
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr);
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px dotted var(--c-line);
}

.basic-row dt {
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--c-ink-faint);
}

.basic-row dd {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--c-ink-soft);
}

.trait-block {
  margin-bottom: 12px;
}

.trait-label {
  display: block;
  margin-bottom: 6px;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--c-ink-faint);
}

.trait-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.chip {
  padding: 3px 8px;
  border: 1px solid var(--c-line);
  background: rgba(255, 253, 248, 0.6);
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--c-shu);
}

.chip.muted {
  color: var(--c-ink-faint);
  background: transparent;
}

.about-main {
  min-width: 0;
}

.about-section {
  margin-bottom: 46px;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.section-index {
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  background: var(--c-shu);
  color: #FFF8F1;
  font-family: var(--font-display);
  font-size: 13px;
  border-radius: 1px;
}

.section-head h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.12em;
  white-space: nowrap;
}

.section-rule {
  flex: 1;
  height: 1px;
  background: var(--c-line);
}

.intro-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.intro-list li {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--c-line);
}

.intro-index {
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--c-shu);
  padding-top: 4px;
}

.intro-list p {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.9;
  color: var(--c-ink);
}

.story {
  margin-bottom: 26px;
  padding-left: 14px;
  border-left: 2px solid var(--c-shu);
}

.story h3 {
  margin: 0 0 8px;
  font-family: var(--font-body);
  font-size: 15.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--c-shu);
}

.story p {
  margin: 0;
  font-size: 14.5px;
  line-height: 2;
  color: var(--c-ink-soft);
  text-align: justify;
}

.relation-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.relation-list li {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px dotted var(--c-line);
}

.relation-name {
  font-family: var(--font-body);
  font-size: 14.5px;
  color: var(--c-ink);
  letter-spacing: 0.06em;
}

.relation-desc {
  font-size: 13.5px;
  line-height: 1.8;
  color: var(--c-ink-soft);
}

.quote {
  margin: 0 0 14px;
  padding: 10px 0 10px 16px;
  border-left: 1px solid var(--c-line-strong);
  font-size: 15.5px;
  line-height: 1.9;
  color: var(--c-ink-soft);
}

@media (max-width: 820px) {
  .about-view {
    width: calc(100% - 32px);
    padding-top: 28px;
  }

  .about-hero {
    grid-template-columns: 72px minmax(0, 1fr);
    gap: 18px;
  }

  .portrait {
    width: 72px;
    height: 72px;
  }

  .about-banner {
    height: 170px;
    margin-top: 20px;
  }

  .about-banner img {
    object-position: 56% 30%;
  }

  .about-banner figcaption {
    left: 12px;
    bottom: 10px;
    font-size: 13px;
  }

  .back-home {
    grid-column: 2;
    justify-self: start;
  }

  .about-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .about-aside {
    position: static;
  }

  .relation-list li {
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 10px;
  }
}
</style>
