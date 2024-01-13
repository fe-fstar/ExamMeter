<script>
    import "../../../app.css";
    import Button from "../../../components/Button.svelte";
    import QuestionTable from "../../../components/QuestionTable.svelte";
    import downloadExcelReport from "$lib/createExcelReport";

    let exams = [];
    let dataforExcel = [];

    let fileNameState = "Rapor";

    const txtOperations = async (e) => {
        var fileNameFull = e.target.files[0].name;
        var fileName = fileNameFull.substring(0, fileNameFull.lastIndexOf("."));
        fileNameState = fileName;
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = () => {
            var fixedResult = reader.result.replaceAll("Ý", "İ");
            var kitapcikAnswers = [];
            var studentsAnswers = [];
            var questionCount = fixedResult
                .split("\n")[0]
                .substring(46)
                .trim().length;

            var questionCorrList = [];
            fixedResult.split("\n").forEach((element) => {
                if (element.substring(21, 26) == "CEVAP") {
                    if (element.charAt(45) == " ") {
                        alert(
                            "Kitapçık türü işaretlenmemiş cevap anahtarı var.",
                        );
                        return;
                    }
                    kitapcikAnswers.push({
                        kitapcik: element.charAt(45),
                        answers: element.substring(46, 46 + questionCount),
                    });
                } else {
                    if (element.trim() !== "" && element.charAt(45) !== " ") {
                        studentsAnswers.push({
                            kitapcik: element.charAt(45),
                            answers: element.substring(46, 46 + questionCount),
                            questionsAnsweredCorrect: [],
                        });
                    }
                }
            });

            kitapcikAnswers.forEach((k) => {
                for (var i = 0; i < questionCount; i++) {
                    let questionEvaluation = {
                        no: i + 1,
                        kitapcik: k.kitapcik,
                        corr: "",
                        points: 0,
                        opa: 0,
                        opb: 0,
                        opc: 0,
                        opd: 0,
                        ope: 0,
                        opbos: 0,
                    };

                    studentsAnswers.forEach((e) => {
                        if (e.kitapcik === k.kitapcik) {
                            if (e.answers.charAt(i) === "A") {
                                questionEvaluation.opa++;
                            } else if (e.answers.charAt(i) === "B") {
                                questionEvaluation.opb++;
                            } else if (e.answers.charAt(i) === "C") {
                                questionEvaluation.opc++;
                            } else if (e.answers.charAt(i) === "D") {
                                questionEvaluation.opd++;
                            } else if (e.answers.charAt(i) === "E") {
                                questionEvaluation.ope++;
                            } else {
                                questionEvaluation.opbos++;
                            }

                            if (e.answers.charAt(i) === k.answers.charAt(i)) {
                                questionEvaluation.points++;
                                questionEvaluation.corr += "1";
                                e.grade ? e.grade++ : (e.grade = 1);
                                e.questionsAnsweredCorrect.push(i + 1);
                            } else {
                                questionEvaluation.corr += "0";
                            }
                        }
                    });
                    questionCorrList.push(questionEvaluation);
                }
            });

            var dataAboveAll = [];

            kitapcikAnswers.forEach((u) => {
                var kitapcik = {
                    kitapcik: u.kitapcik,
                    questions: [],
                };

                var questionForKitapcik = questionCorrList.filter((e) => {
                    return e.kitapcik === u.kitapcik;
                });

                questionForKitapcik.forEach((question) => {
                    question.studentAnswersWithGrades = [];

                    studentsAnswers.forEach((student) => {
                        if (student.kitapcik === question.kitapcik) {
                            question.studentAnswersWithGrades.push({
                                a:
                                    student.answers.charAt(question.no - 1) ==
                                    "A"
                                        ? 1
                                        : 0,
                                b:
                                    student.answers.charAt(question.no - 1) ==
                                    "B"
                                        ? 1
                                        : 0,
                                c:
                                    student.answers.charAt(question.no - 1) ==
                                    "C"
                                        ? 1
                                        : 0,
                                d:
                                    student.answers.charAt(question.no - 1) ==
                                    "D"
                                        ? 1
                                        : 0,
                                e:
                                    student.answers.charAt(question.no - 1) ==
                                    "E"
                                        ? 1
                                        : 0,
                                grade: student.grade,
                            });
                        }
                    });

                    let sum_grade = 0;
                    let sum_a = 0;
                    let sum_b = 0;
                    let sum_c = 0;
                    let sum_d = 0;
                    let sum_e = 0;

                    question.studentAnswersWithGrades.forEach((answer) => {
                        sum_grade += answer.grade;
                        sum_a += answer.a;
                        sum_b += answer.b;
                        sum_c += answer.c;
                        sum_d += answer.d;
                        sum_e += answer.e;
                    });

                    let mean_grade =
                        sum_grade / question.studentAnswersWithGrades.length;
                    let mean_a =
                        sum_a / question.studentAnswersWithGrades.length;
                    let mean_b =
                        sum_b / question.studentAnswersWithGrades.length;
                    let mean_c =
                        sum_c / question.studentAnswersWithGrades.length;
                    let mean_d =
                        sum_d / question.studentAnswersWithGrades.length;
                    let mean_e =
                        sum_e / question.studentAnswersWithGrades.length;

                    // (grade - mean_grade) * (grade - mean_grade)
                    // (a - mean_a) * (a - mean_a)
                    // (b - mean_b) * (b - mean_b)
                    // (c - mean_c) * (c - mean_c)
                    // (d - mean_d) * (d - mean_d)
                    // (e - mean_e) * (e - mean_e)
                    // (grade - mean_grade) * (a - mean_a)
                    // (grade - mean_grade) * (b - mean_b)
                    // (grade - mean_grade) * (c - mean_c)
                    // (grade - mean_grade) * (d - mean_d)
                    // (grade - mean_grade) * (e - mean_e)

                    let sum_of_grade_difference_grade_mean_squared = 0;
                    let sum_of_a_difference_a_mean_squared = 0;
                    let sum_of_b_difference_b_mean_squared = 0;
                    let sum_of_c_difference_c_mean_squared = 0;
                    let sum_of_d_difference_d_mean_squared = 0;
                    let sum_of_e_difference_e_mean_squared = 0;
                    let sum_of_grade_difference_mean_grade_times_a_difference_a_mean = 0;
                    let sum_of_grade_difference_mean_grade_times_b_difference_b_mean = 0;
                    let sum_of_grade_difference_mean_grade_times_c_difference_c_mean = 0;
                    let sum_of_grade_difference_mean_grade_times_d_difference_d_mean = 0;
                    let sum_of_grade_difference_mean_grade_times_e_difference_e_mean = 0;

                    question.studentAnswersWithGrades.forEach((answer) => {
                        sum_of_grade_difference_grade_mean_squared +=
                            (answer.grade - mean_grade) *
                            (answer.grade - mean_grade);
                        sum_of_a_difference_a_mean_squared +=
                            (answer.a - mean_a) * (answer.a - mean_a);
                        sum_of_b_difference_b_mean_squared +=
                            (answer.b - mean_b) * (answer.b - mean_b);
                        sum_of_c_difference_c_mean_squared +=
                            (answer.c - mean_c) * (answer.c - mean_c);
                        sum_of_d_difference_d_mean_squared +=
                            (answer.d - mean_d) * (answer.d - mean_d);
                        sum_of_e_difference_e_mean_squared +=
                            (answer.e - mean_e) * (answer.e - mean_e);
                        sum_of_grade_difference_mean_grade_times_a_difference_a_mean +=
                            (answer.grade - mean_grade) * (answer.a - mean_a);
                        sum_of_grade_difference_mean_grade_times_b_difference_b_mean +=
                            (answer.grade - mean_grade) * (answer.b - mean_b);
                        sum_of_grade_difference_mean_grade_times_c_difference_c_mean +=
                            (answer.grade - mean_grade) * (answer.c - mean_c);
                        sum_of_grade_difference_mean_grade_times_d_difference_d_mean +=
                            (answer.grade - mean_grade) * (answer.d - mean_d);
                        sum_of_grade_difference_mean_grade_times_e_difference_e_mean +=
                            (answer.grade - mean_grade) * (answer.e - mean_e);
                    });

                    // console.log("####################")
                    // console.log(sum_of_grade_difference_grade_mean_squared);
                    // console.log(sum_of_a_difference_a_mean_squared);
                    // console.log(sum_of_b_difference_b_mean_squared);
                    // console.log(sum_of_grade_difference_mean_grade_times_a_difference_a_mean);
                    // console.log(sum_of_grade_difference_mean_grade_times_b_difference_b_mean);
                    // console.log("####################")

                    question.a_distinctiveness = isNaN(
                        Math.round(
                            (sum_of_grade_difference_mean_grade_times_a_difference_a_mean /
                                Math.sqrt(
                                    sum_of_grade_difference_grade_mean_squared *
                                        sum_of_a_difference_a_mean_squared,
                                )) *
                                1000,
                        ) / 1000,
                    )
                        ? 0
                        : Math.round(
                              (sum_of_grade_difference_mean_grade_times_a_difference_a_mean /
                                  Math.sqrt(
                                      sum_of_grade_difference_grade_mean_squared *
                                          sum_of_a_difference_a_mean_squared,
                                  )) *
                                  1000,
                          ) / 1000;
                    question.b_distinctiveness = isNaN(
                        Math.round(
                            (sum_of_grade_difference_mean_grade_times_b_difference_b_mean /
                                Math.sqrt(
                                    sum_of_grade_difference_grade_mean_squared *
                                        sum_of_b_difference_b_mean_squared,
                                )) *
                                1000,
                        ) / 1000,
                    )
                        ? 0
                        : Math.round(
                              (sum_of_grade_difference_mean_grade_times_b_difference_b_mean /
                                  Math.sqrt(
                                      sum_of_grade_difference_grade_mean_squared *
                                          sum_of_b_difference_b_mean_squared,
                                  )) *
                                  1000,
                          ) / 1000;
                    question.c_distinctiveness = isNaN(
                        Math.round(
                            (sum_of_grade_difference_mean_grade_times_c_difference_c_mean /
                                Math.sqrt(
                                    sum_of_grade_difference_grade_mean_squared *
                                        sum_of_c_difference_c_mean_squared,
                                )) *
                                1000,
                        ) / 1000,
                    )
                        ? 0
                        : Math.round(
                              (sum_of_grade_difference_mean_grade_times_c_difference_c_mean /
                                  Math.sqrt(
                                      sum_of_grade_difference_grade_mean_squared *
                                          sum_of_c_difference_c_mean_squared,
                                  )) *
                                  1000,
                          ) / 1000;
                    question.d_distinctiveness = isNaN(
                        Math.round(
                            (sum_of_grade_difference_mean_grade_times_d_difference_d_mean /
                                Math.sqrt(
                                    sum_of_grade_difference_grade_mean_squared *
                                        sum_of_d_difference_d_mean_squared,
                                )) *
                                1000,
                        ) / 1000,
                    )
                        ? 0
                        : Math.round(
                              (sum_of_grade_difference_mean_grade_times_d_difference_d_mean /
                                  Math.sqrt(
                                      sum_of_grade_difference_grade_mean_squared *
                                          sum_of_d_difference_d_mean_squared,
                                  )) *
                                  1000,
                          ) / 1000;
                    question.e_distinctiveness = isNaN(
                        Math.round(
                            (sum_of_grade_difference_mean_grade_times_e_difference_e_mean /
                                Math.sqrt(
                                    sum_of_grade_difference_grade_mean_squared *
                                        sum_of_e_difference_e_mean_squared,
                                )) *
                                1000,
                        ) / 1000,
                    )
                        ? 0
                        : Math.round(
                              (sum_of_grade_difference_mean_grade_times_e_difference_e_mean /
                                  Math.sqrt(
                                      sum_of_grade_difference_grade_mean_squared *
                                          sum_of_e_difference_e_mean_squared,
                                  )) *
                                  1000,
                          ) / 1000;

                    // console.log("################################");
                    // console.log("A: " + question.a_distinctiveness);
                    // console.log("B: " + question.b_distinctiveness);
                    // console.log("C: " + question.c_distinctiveness);
                    // console.log("D: " + question.d_distinctiveness);
                    // console.log("E: " + question.e_distinctiveness);
                    // console.log("################################");
                });

                var y_sum = 0;
                var student_count = 0;
                studentsAnswers.forEach((s) => {
                    if (s.kitapcik === u.kitapcik) {
                        y_sum += s.grade;
                        student_count++;
                    }
                });
                var y_mean = y_sum / student_count;

                questionForKitapcik.forEach((r) => {
                    var x_sum = 0;
                    studentsAnswers.forEach((s) => {
                        if (
                            s.kitapcik === u.kitapcik &&
                            s.questionsAnsweredCorrect.includes(parseInt(r.no))
                        ) {
                            x_sum++;
                        }
                    });
                    var x_mean = x_sum / student_count;

                    var sum_of_x_minus_x_mean_times_y_minus_y_mean = 0;
                    var sum_of_x_minus_x_mean_square = 0;
                    var sum_of_y_minus_y_mean_square = 0;

                    studentsAnswers.forEach((s) => {
                        if (s.kitapcik === u.kitapcik) {
                            var xi = s.questionsAnsweredCorrect.includes(
                                parseInt(r.no),
                            )
                                ? 1
                                : 0;
                            var yi = s.grade;
                            sum_of_x_minus_x_mean_times_y_minus_y_mean +=
                                (xi - x_mean) * (yi - y_mean);
                            sum_of_x_minus_x_mean_square +=
                                (xi - x_mean) * (xi - x_mean);
                            sum_of_y_minus_y_mean_square +=
                                (yi - y_mean) * (yi - y_mean);
                        }
                    });

                    var question = {
                        no: r.no,
                        correct: r.points,
                        wrong: r.corr.length - r.points,
                        correctPossibility:
                            Math.round((r.points / r.corr.length) * 100) / 100,
                        correlation:
                            Math.round(
                                (sum_of_x_minus_x_mean_times_y_minus_y_mean /
                                    Math.sqrt(
                                        sum_of_x_minus_x_mean_square *
                                            sum_of_y_minus_y_mean_square,
                                    )) *
                                    100,
                            ) / 100,
                        opfreq: {
                            a: r.opa,
                            b: r.opb,
                            c: r.opc,
                            d: r.opd,
                            e: r.ope,
                            bos: r.opbos,
                            total: r.corr.length,
                        },
                        optionsDistinctiveness: {
                            a: r.a_distinctiveness,
                            b: r.b_distinctiveness,
                            c: r.c_distinctiveness,
                            d: r.d_distinctiveness,
                            e: r.e_distinctiveness,
                        },
                    };
                    kitapcik.questions.push(question);
                });
                dataAboveAll.push(kitapcik);
            });

            // For each question, calculate how many students answered each option
            // and for each student answered that question, calculate how many question(s) they answered correct.

            // Find the correlation of "answered count of the option" and "sum of correct answers all students got in total".
            exams = [];
            dataAboveAll.forEach((booklet) => {
                let new_struct_questions = [];
                booklet.questions.forEach((question) => {
                    new_struct_questions.push({
                        options: [
                            {
                                frequency: question.opfreq.a,
                                frequency_ratio:
                                    Math.round(
                                        (question.opfreq.a /
                                            question.opfreq.total) *
                                            100,
                                    ) / 100,
                                discrimination_ratio:
                                    question.optionsDistinctiveness.a,
                            },
                            {
                                frequency: question.opfreq.b,
                                frequency_ratio:
                                    Math.round(
                                        (question.opfreq.b /
                                            question.opfreq.total) *
                                            100,
                                    ) / 100,
                                discrimination_ratio:
                                    question.optionsDistinctiveness.b,
                            },
                            {
                                frequency: question.opfreq.c,
                                frequency_ratio:
                                    Math.round(
                                        (question.opfreq.c /
                                            question.opfreq.total) *
                                            100,
                                    ) / 100,
                                discrimination_ratio:
                                    question.optionsDistinctiveness.c,
                            },
                            {
                                frequency: question.opfreq.d,
                                frequency_ratio:
                                    Math.round(
                                        (question.opfreq.d /
                                            question.opfreq.total) *
                                            100,
                                    ) / 100,
                                discrimination_ratio:
                                    question.optionsDistinctiveness.d,
                            },
                            {
                                frequency: question.opfreq.e,
                                frequency_ratio:
                                    Math.round(
                                        (question.opfreq.e /
                                            question.opfreq.total) *
                                            100,
                                    ) / 100,
                                discrimination_ratio:
                                    question.optionsDistinctiveness.e,
                            },
                        ],
                        correct_count: question.correct,
                        incorrect_count: question.wrong,
                        unanswered_count: question.opfreq.bos,
                        correct_ratio: question.correctPossibility,
                        difficultyMessage:
                            question.correctPossibility <= 0.2
                                ? "Çok zor"
                                : question.correctPossibility <= 0.4
                                  ? "Zor"
                                  : question.correctPossibility <= 0.6
                                    ? "Orta güçlük"
                                    : question.correctPossibility <= 0.8
                                      ? "Kolay"
                                      : "Çok kolay",
                        discriminationRatio: question.correlation,
                        discriminationStatus:
                            question.correlation <= 0.2
                                ? "Madde çok zayıf, testten çıkarılmalı"
                                : question.correlation <= 0.3
                                  ? "Madde düzeltildikten sonra teste alınmalı"
                                  : question.correlation <= 0.4
                                    ? "Madde ayırt ediciliği iyi"
                                    : "Madde ayırt ediciliği mükemmel",
                    });
                });

                exams.push({
                    kitapcik_turu: booklet.kitapcik,
                    questions: new_struct_questions,
                });
            });
            dataforExcel = dataAboveAll;
            console.log(exams);
        };
        reader.readAsText(file);
    };
</script>

<div class="flex flex-col items-center">
    <h2>Optik Dosyası Üzerinden Sınav Analizi</h2>
    <p>Lütfen cevap dosyasını sisteme yükleyiniz.</p>
    <div class="icontainer mb-8 flex items-center">
        <input
            class="bg-gray-800"
            accept=".txt, .dat"
            type="file"
            on:change={(e) => txtOperations(e)}
        />
    </div>

    {#if dataforExcel.length != 0}
        <div class="descendant:text-custom_white">
            <button class="px-6 py-3 bg-gray-800 text-white rounded-lg text-sm font-semibold shadow-md ease-out hover:opacity-75 duration-300 select-none disabled:cursor-not-allowed disabled:opacity-75 flex flex-row gap-2 items-center"
                on:click={() =>
                    downloadExcelReport(dataforExcel, fileNameState)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                </svg>
                Raporu İndir
            </button>
        </div>
    {/if}

    <div class="w-[85vw] max-w-6xl">
        {#each exams as exam}
            <div>
                <h3>Kitapçık Türü: {exam.kitapcik_turu}</h3>
                <QuestionTable questions={exam.questions} />
            </div>
        {/each}
    </div>
</div>
