import { fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'
import bcrypt from 'bcrypt'

import { db } from '$lib/database'

// using an enum for user roles to avoid typos
// if you're not using TypeScript use an object

export const load: PageServerLoad = async () => {
  // todo
}

const register: Action = async ({ request }) => {
  const data = await request.formData()
  const username = data.get('username')
  const password = data.get('password')

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !username ||
    !password
  ) {
    return fail(400, { invalid: true })
  }

  const user = await db.user.findUnique({
    where: { username },
  })

  if (user) {
    return fail(400, { user: true })
  }

  await db.user.create({
    data: {
      username,
      passwordHash: await bcrypt.hash(password, 10),
      userAuthToken: crypto.randomUUID(),
    },
  })

  redirect(303, '/')
}

export const actions: Actions = { register }
