const express = require("express");
const router = express.Router();
const pool = require("./db");
const SHA256 = require("crypto-js/sha256");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Production- Api Online!",
  });
  console.log("안뇽, 여긴 api 루트양. 여긴 왜왔니?");
});

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

//수업 리뷰 받아오기
router.get("/courses/:id/reviews", (req, res) => {
  const courseId = req.params.id;
  pool.query(
    "SELECT * FROM reviews WHERE course_id = ?",
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

// id에 해당하는 강의에 새로운 리뷰 추가
router.post("/courses/:id/reviews", (req, res) => {
  const courseId = req.params.id;
  const { reviewContent, instructorName, reviewTitle, semester, gradeGot } =
    req.body;
  const formattedReview = reviewContent.replace(/\n/g, "<br>");
  const sql =
    "INSERT INTO reviews (course_id, review_content, instructor_name, review_title, taken_semyr, grade) VALUES (?, ?, ?, ?, ?, ?)";

  pool.query(
    sql,
    [
      courseId,
      formattedReview,
      instructorName,
      reviewTitle,
      semester,
      gradeGot,
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

// 커뮤니티 글 불러오기
router.get("/community", (req, res) => {
  pool.query(
    "SELECT * FROM community",
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving posts from database");
      } else {
        res.json(results);
      }
    }
  );
});

// 커뮤니티 특정 글 내용 불러오기
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
router.post("/community", async (req, res) => {
  const email = req.body.email;
  const postCategory = req.body.post_category;
  const postTitle = req.body.post_title;
  const postContent = req.body.post_content;

  const query = (sql, params) => new Promise((resolve, reject) => {
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
