"use client";

import { RotateCcw, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/content/week-1";
import { useProgress } from "@/lib/progress/progress-store";

export function QuizCard({
  quizId,
  questions,
}: {
  quizId: string;
  questions: QuizQuestion[];
}) {
  const { state, saveQuizScore } = useProgress();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () =>
      questions.reduce(
        (total, question) =>
          answers[question.id] === question.answer ? total + 1 : total,
        0,
      ),
    [answers, questions],
  );

  const bestScore = state.quizScores[quizId] ?? 0;

  function submit() {
    setSubmitted(true);
    saveQuizScore(quizId, score);
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <section className="rounded-lg border border-line bg-surface p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Mini quiz du soir</h2>
          <p className="text-sm text-muted-foreground">
            Meilleur score : {bestScore}/{questions.length}
          </p>
        </div>
        {submitted ? (
          <div className="inline-flex items-center gap-2 rounded-md bg-success-soft px-3 py-2 text-sm font-medium text-success-strong">
            <Trophy size={17} aria-hidden="true" />
            Score : {score}/{questions.length}
          </div>
        ) : null}
      </div>

      <div className="mt-5 space-y-4">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.answer;
          return (
            <fieldset key={question.id} className="rounded-md border border-line p-4">
              <legend className="px-1 text-sm font-semibold text-foreground">
                {index + 1}. {question.question}
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {question.choices.map((choice, choiceIndex) => (
                  <label
                    key={choice}
                    className={`flex min-h-11 cursor-pointer items-center rounded-md border px-3 py-2 text-sm transition ${
                      selected === choiceIndex
                        ? "border-accent bg-accent-soft text-foreground"
                        : "border-line bg-background hover:bg-surface-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      className="sr-only"
                      checked={selected === choiceIndex}
                      onChange={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: choiceIndex,
                        }))
                      }
                    />
                    {choice}
                  </label>
                ))}
              </div>
              {submitted ? (
                <p
                  className={`mt-3 rounded-md px-3 py-2 text-sm ${
                    isCorrect
                      ? "bg-success-soft text-success-strong"
                      : "bg-danger-soft text-danger"
                  }`}
                >
                  {isCorrect ? "Correct." : "À revoir."} {question.explanation}
                </p>
              ) : null}
            </fieldset>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={Object.keys(answers).length !== questions.length}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-contrast hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-muted"
        >
          <Trophy size={17} aria-hidden="true" />
          Valider le quiz
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-medium hover:bg-surface-muted"
        >
          <RotateCcw size={17} aria-hidden="true" />
          Recommencer
        </button>
      </div>
    </section>
  );
}
