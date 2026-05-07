export default function handler(req, res) {
  const pdfLink = 'https://drive.google.com/file/d/1miSkQ1liZy_Hi95cu-YDzJomWnKr5WL1/view?usp=sharing';
  res.redirect(302, pdfLink);
}
