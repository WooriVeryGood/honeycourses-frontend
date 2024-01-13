const express = require("express");
const router = express.Router();
const pool = require("./db");
const SHA256 = require("crypto-js/sha256");

/**
 * @swagger
 * tags:
 *   name: /
 *   description: API 루트
 */

/**
 * @swagger
 * paths:
 *  /:
 *    get:
 *      summary: "API 루트"
 *      description: "API 루트 접속, 접속 확인에 사용 가능"
 *      tags: [/]
 *      responses:
 *        "200":
 *          description: 확인 메세지
 *          content:
 *            application/json:
 *               example:
 *                message: "Production- Api Online!"
 *
 */
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Production- Api Online!",
  });
  console.log("안뇽, 여긴 api 루트양. 여긴 왜왔니?");
});

/**
 * @swagger
 * tags:
 *   name: /courses
 *   description: 강의평가 기능 관련 API
 */
/**
 * @swagger
 * paths:
 *  /courses:
 *    get:
 *      summary: "수업 리스트 받아오기"
 *      description: "DB에 있는 courses 테이블의 수업들을 받아오는 엔드포인트"
 *      tags: [/courses]
 *      responses:
 *        "200":
 *          description: "수업 리스트"
 *          content:
 *            application/json:
 *              example:
 *                - course_id: 2
 *                  course_name: "计算概论（C）"
 *                  course_credit: 3
 *                  course_category: "文科生必修"
 *                  isYouguan: 0
 *                  kaikeYuanxi: "信息科学技术学院"
 */

// 수업 리스트 받아오기
router.get("/courses", (req, res) => {
  pool.query("SELECT * FROM courses", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error retrieving courses from database");
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * paths:
 *  /courses/{id}/reviews:
 *    get:
 *      summary: "수업 리뷰 받아오기"
 *      description: "해당 수업 ID에 대한 리뷰들을 DB에서 가져오는 엔드포인트"
 *      tags: [/courses]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: "수업 ID"
 *          schema:
 *            type: integer
 *      responses:
 *        "200":
 *          description: "리뷰 리스트"
 *          content:
 *            application/json:
 *              example:
 *                - review_id: 17
 *                  course_id: 2
 *                  review_content: "考核방식: <br>숙제: 25%<br>大作业: 5%<br>..."
 *                  instructor_name: "马郓"
 *                  review_title: "찌까이는 마윈입니다"
 *                  taken_semyr: "21-22년도 1학기"
 *                  grade: "80"
 *                  review_point: 3
 */

//수업 리뷰 받아오기
router.get("/courses/:id/reviews", (req, res) => {
  const courseId = req.params.id;
  pool.query(
    "SELECT review_id, course_id, review_content, review_title, review_point, instructor_name, taken_semyr, grade FROM reviews WHERE course_id = ?",
    [courseId],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving reviews from database");
      } else {
        res.json(results);
      }
    }
  );
});

/**
 * @swagger
 * paths:
 *  /courses/{id}/name:
 *    get:
 *      summary: "수업 이름 받아오기"
 *      description: "해당 수업 ID의 이름을 DB에서 가져오는 엔드포인트"
 *      tags: [/courses]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: "수업 ID"
 *          schema:
 *            type: integer
 *      responses:
 *        "200":
 *          description: "수업 이름"
 *          content:
 *            application/json:
 *              example:
 *                - course_name: "计算概论（C）"
 */

// 수업 이름 받아오기
router.get("/courses/:id/name", (req, res) => {
  const courseId = req.params.id;
  pool.query(
    "SELECT course_name FROM courses where course_id = ?",
    [courseId],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving courses from database");
      } else {
        if (results.length === 0) {
          res.status(404).send("No such course found.");
        } else {
          res.json(results);
        }
      }
    }
  );
});

/**
 * @swagger
 * paths:
 *  /courses/{id}/reviews:
 *    post:
 *      summary: "새로운 리뷰 추가하기"
 *      description: "해당 수업 ID에 새로운 리뷰를 추가하는 엔드포인트"
 *      tags: [/courses]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: "수업 ID"
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            example:
 *              reviewContent: "우왕 수업 개좋아용"
 *              instructorName: "郭炜"
 *              reviewTitle: "강추"
 *              semester: "21-22년도 1학기"
 *              gradeGot: "80+"
 *      responses:
 *        "200":
 *          description: "리뷰 추가 성공 메세지"
 *          content:
 *            application/json:
 *              example:
 *                message: "Review added!"
 */

// id에 해당하는 강의에 새로운 리뷰 추가
router.post("/courses/:id/reviews", (req, res) => {
  const courseId = req.params.id;
  const { reviewContent, instructorName, reviewTitle, semester, gradeGot, userEmail } =
    req.body;
  const formattedReview = reviewContent.replace(/\n/g, "<br>");
  const sql =
    "INSERT INTO reviews (course_id, review_content, instructor_name, review_title, taken_semyr, grade, author_email) VALUES (?, ?, ?, ?, ?, ?, ?)";

  pool.query(
    sql,
    [
      courseId,
      formattedReview,
      instructorName,
      reviewTitle,
      semester,
      gradeGot,
      userEmail
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error adding reviews to the database");
        return;
      }
      console.log(`New review added for course ID ${courseId}`);
      res.status(200).send("Review added!");
    }
  );
});

/**
 * @swagger
 * paths:
 *  /courses:
 *    post:
 *      summary: "새로운 수업 추가하기"
 *      description: "새로운 수업을 추가하는 엔드포인트"
 *      tags: [/courses]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            example:
 *              courseName: "计算概论（C）"
 *              courseCredit: 3
 *              courseCategory: "文科生必修"
 *              yuanxi: "信息科学技术学院"
 *              youGuanStat: 0
 *      responses:
 *        "200":
 *          description: "수업 추가 성공 메세지"
 *          content:
 *            application/json:
 *              example:
 *                message: "Course added!"
 */

// 새로운 수업 추가
router.post("/courses", (req, res) => {
  const { courseName, courseCredit, courseCategory, yuanxi, youGuanStat } =
    req.body;
  const sql = `INSERT INTO courses (course_name, course_credit, course_category, kaikeYuanxi, isYouguan) VALUES (?, ?, ?, ?, ?)`;

  pool.query(
    sql,
    [courseName, courseCredit, courseCategory, yuanxi, youGuanStat],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error adding courses to the database");
        return;
      }
      console.log(`New course added :${courseName}`);
      res.status(200).send("Course added!");
    }
  );
});

/**
 * @swagger
 * paths:
 *  /courses/{id}/reviews/{rid}:
 *    post:
 *      summary: "리뷰 추천/비추천 점수 업데이트"
 *      description: "해당 수업 ID의 특정 리뷰에 대한 추천 또는 비추천 점수를 업데이트하는 엔드포인트입니다."
 *      tags: [/courses]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: "수업 ID"
 *          schema:
 *            type: integer
 *        - name: rid
 *          in: path
 *          required: true
 *          description: "리뷰 ID"
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            example:
 *              reviewPoint: 4
 *      responses:
 *        "200":
 *          description: "업데이트 성공 메세지"
 *          content:
 *            application/json:
 *              example:
 *                message: "Review point updated for Review_id: ${reviewId}"
 *        
 *        "500":
 *          description: "오류"
 *          content:
 *            application/json:
 *              example:
 *                message: "Error updating review points to the database"
 */

// 추천, 비추 업데이트
router.post("/courses/:id/reviews/:rid", (req, res) => {
  // const courseId = req.params.id;
  const reviewId = req.params.rid;
  const { reviewPoint } = req.body;
  const sql = "UPDATE reviews SET review_point = ? WHERE review_id = ?";

  pool.query(sql, [reviewPoint, reviewId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating review points to the database");
      return;
    }
    console.log(`Review point updated for Review_id: ${reviewId}`);
    res.status(200).send("Review point updated!");
  });
});

/**
 * @swagger
 * tags:
 *   name: /community
 *   description: 커뮤니티 기능 관련 API
 */

// 커뮤니티 글 불러오기
/**
 * @swagger
 * paths:
 *  /community:
 *    get:
 *      summary: "커뮤니티 글 불러오기"
 *      description: "커뮤니티에서 모든 글을 불러오는 엔드포인트"
 *      tags: [/community]
 *      responses:
 *        "200":
 *          description: "성공적으로 글을 불러옴"
 *          content:
 *            application/json:
 *              example:
 *                - post_id: 1
 *                  post_likes: 0
 *                  post_comments: 11
 *                  post_category: "자유"
 *                  post_author: "8deee259d7fb23aca5885306920247d567be6514549993c81411221835bea5cb"
 *                  post_title: "Hello World!"
 *                  post_content: "커뮤니티 기능 구현 너무 힘들다 에오\n\n안아줘요"
 *                  post_time: "2023-08-13T14:48:38.000Z"
 */

router.get("/community", (req, res) => {
  pool.query("SELECT * FROM community", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error retrieving posts from database");
    } else {
      res.json(results);
    }
  });
});

// 커뮤니티 특정 글 내용, 댓글 불러오기
/**
 * @swagger
 * paths:
 *  /community/{id}:
 *    get:
 *      summary: "커뮤니티 특정 글 내용 불러오기"
 *      description: "커뮤니티에서 특정 글의 내용을 불러오는 엔드포인트"
 *      tags: [/community]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: "게시글 ID"
 *          schema:
 *            type: integer
 *      responses:
 *        "200":
 *          description: "성공적으로 글을 불러옴"
 *          content:
 *            application/json:
 *              example:
 *                - post_id: 1
 *                  post_likes: 0
 *                  post_comments: 11
 *                  post_category: "자유"
 *                  post_author: "8deee259d7fb23aca5885306920247d567be6514549993c81411221835bea5cb"
 *                  post_title: "Hello World!"
 *                  post_content: "커뮤니티 기능 구현 너무 힘들다 에오\n\n안아줘요"
 *                  post_time: "2023-08-13T14:48:38.000Z"
 */

router.get("/community/:id", (req, res) => {
  pool.query(
    "SELECT * FROM community WHERE post_id = ?",
    [req.params.id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving post from database");
      } else {
        res.json(results);
      }
    }
  );
});

// 커뮤니티 특정 글 댓글 불러오기
/**
 * @swagger
 * paths:
 *  /community/{id}/comments:
 *    get:
 *      summary: "커뮤니티 특정 글 댓글 불러오기"
 *      description: "커뮤니티의 특정 글에 대한 모든 댓글을 불러옵니다."
 *      tags: [/community]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: "게시글 ID"
 *          schema:
 *            type: integer
 *      responses:
 *        "200":
 *          description: "성공적으로 댓글을 불러옴"
 *          content:
 *            application/json:
 *              example:
 *                - comment_author: "8deee259d7fb23aca5885306920247d567be6514549993c81411221835bea5cb"
 *                  comment_content: "댓글 테스트!"
 *                  post_id: 1
 *                  comment_id: 1
 */

router.get("/community/:id/comments", (req, res) => {
  pool.query(
    "SELECT * FROM comments WHERE post_id = ?",
    [req.params.id],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving comments from database");
      } else {
        res.json(results);
      }
    }
  );
});

// 커뮤니티 댓글 작성
/**
 * @swagger
 * paths:
 *  /community/{id}/comment:
 *    post:
 *      summary: "커뮤니티 댓글 작성"
 *      description: "커뮤니티의 특정 글에 댓글을 작성합니다."
 *      tags: [/community]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: "게시글 ID"
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            example:
 *              email: "1800094804@pku.edu.cn"
 *              content: "댓글 테스트!"
 *      responses:
 *        "200":
 *          description: "성공적으로 댓글을 저장함"
 */

router.post("/community/:id/comment", (req, res) => {
  const email = req.body.email;
  const postId = req.params.id;
  const content = req.body.content;

  // Hash the email with the post ID to generate a unique identifier
  const commentAuthorHash = SHA256(email + postId).toString();

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error getting database connection");
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error(err);
        return res.status(500).send("Error beginning transaction");
      }

      connection.query(
        "INSERT INTO comments (comment_content, comment_author, post_id) VALUES (?, ?, ?)",
        [content, commentAuthorHash, postId],
        (error, results) => {
          if (error) {
            console.error(error);
            return connection.rollback(() => {
              connection.release();
              res.status(500).send("Error saving comment to database");
            });
          }

          connection.query(
            "UPDATE community SET post_comments = post_comments + 1 WHERE post_id = ?",
            [postId],
            (updateError) => {
              if (updateError) {
                console.error(updateError);
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).send("Error updating comment count");
                });
              }

              connection.commit((commitError) => {
                if (commitError) {
                  console.error(commitError);
                  return connection.rollback(() => {
                    connection.release();
                    res.status(500).send("Error committing transaction");
                  });
                }

                connection.release();
                res.json(results);
              });
            }
          );
        }
      );
    });
  });
});

// 커뮤니티 새 글 작성
/**
 * @swagger
 * paths:
 *  /community:
 *    post:
 *      summary: "커뮤니티 새 글 작성"
 *      description: "커뮤니티에 새로운 글을 작성합니다."
 *      tags: [/community]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            example:
 *              email: "user@example.com"
 *              post_category: "질문"
 *              post_title: "배고프"
 *              post_content: "중관주변 와이마이 맛집 추천받아요"
 *      responses:
 *        "200":
 *          description: "성공적으로 글을 작성함"
 */

router.post("/community", async (req, res) => {
  const email = req.body.email;
  const postCategory = req.body.post_category;
  const postTitle = req.body.post_title;
  const postContent = req.body.post_content;

  const query = (sql, params) =>
    new Promise((resolve, reject) => {
      pool.query(sql, params, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

  try {
    await query(
      "INSERT INTO community (post_category, post_title, post_content, post_time) VALUES (?, ?, ?, NOW())",
      [postCategory, postTitle, postContent]
    );

    const postIdResult = await query("SELECT LAST_INSERT_ID() AS lastId");
    const newPostId = postIdResult[0].lastId;

    console.log("New Post ID:", newPostId);

    const postAuthorHash = SHA256(email + newPostId).toString();
    console.log("Post Author Hash:", postAuthorHash);

    await query("UPDATE community SET post_author = ? WHERE post_id = ?", [
      postAuthorHash,
      newPostId,
    ]);

    res.json({ success: true, postId: newPostId });
  } catch (error) {
    console.error("Error adding post to database:", error);
    res.status(500).send("Error adding post to database");
  }
});

module.exports = router;
