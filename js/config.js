export { apiKeys, mailPrefs, patterns }

const githubUser = "srphilippe"

const apiKeys = {
  public: {
    emailjs: "9CEj6LfIzI9NzUiv_",
    github: `https://api.github.com/users/${githubUser}`,
    repos: `https://api.github.com/users/${githubUser}/repos`
  }
}

const mailPrefs = {
  templateId: "template_3fubw4l",
  contactService: "service_5isf3yr"

}

const patterns = {
  mail: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
}