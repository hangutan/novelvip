import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn(user, account, profile) {
      console.log("data signIn :", user, account, profile)
      // if (account.provider === 'google' &&
      //     profile.verified_email === true &&
      //     profile.email.endsWith('@example.com')) {
      //   return true
      // } else {
      //   return false
      // }
    },
  }
});