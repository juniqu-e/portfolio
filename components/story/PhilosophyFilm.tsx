// Original motion study: a choice becomes a connection, then possibilities.
// The clip has no audio. Playback begins only when the visitor chooses to play.
export function PhilosophyFilm() {
  return (
    <section aria-labelledby="philosophy-film-title" className="px-4 pb-16 sm:px-8 sm:pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between gap-4 font-mono text-xs">
          <h2 id="philosophy-film-title" className="text-term-muted">
            <span className="text-term-green">$</span> play ~/philosophy.mp4
          </h2>
          <span className="text-term-dim">15 seconds · motion study</span>
        </div>
        <figure>
          <video
            className="aspect-video w-full border border-term-line bg-term-bg"
            controls
            muted
            playsInline
            preload="none"
            poster="/media/philosophy/poster.jpg"
            width={1280}
            height={720}
            aria-label="선택이 연결로, 연결이 가능성으로 넓어지는 15초 애니메이션. 소리가 없는 영상입니다."
            aria-describedby="philosophy-film-transcript"
          >
            <source src="/media/philosophy/junik-philosophy.mp4" type="video/mp4" />
            <a href="/media/philosophy/junik-philosophy.mp4">철학 영상 보기</a>
          </video>
          <figcaption className="mt-3 text-sm leading-relaxed text-term-muted">
            선택에서 연결로, 연결에서 더 넓은 가능성으로.
          </figcaption>
        </figure>
        <details className="mt-3 text-xs leading-relaxed text-term-muted">
          <summary className="w-fit cursor-pointer font-mono text-term-dim transition-colors hover:text-term-green">
            영상 내용 읽기
          </summary>
          <p id="philosophy-film-transcript" className="mt-3 max-w-2xl break-keep">
            작은 초록 점이 같은 궤도를 돌다가 새로운 방향을 선택합니다.
            “미래를 바꾸려면, 변화의 대가도 선택해야 한다.”
            그 점에서 연결이 퍼지며 서버와 기록, 학습과 영상 도구가 나타납니다.
            “기술의 가치는 사람이 할 수 있는 일을 넓히는 데 있다.”
            이준익, Infrastructure Engineer.
          </p>
        </details>
      </div>
    </section>
  );
}
