import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { mount, flushPromises } from '@vue/test-utils'
import SignUpPage from './SignUpPage.vue'

describe('Sign Up Page', () => {
  let requestBody
  const server = setupServer(
    rest.post('/api/users', async (req, res, ctx) => {
      requestBody = await req.json()
      return res(ctx.status(201), ctx.json({ message: 'ok' }))
    })
  )
  beforeEach(() => {
    location.replace(`http://127.0.0.1`)
  })
  // Start server before all tests
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
  //  Close server after all tests
  afterAll(() => server.close())
  // Reset handlers after each test `important for test isolation`
  afterEach(() => server.resetHandlers())
  describe('Layout', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(SignUpPage)
    })
    it('has Sign Up Header', () => {
      expect(wrapper.find('h1').text()).eq('Sign Up')
    })
    it('has username input', () => {
      expect(wrapper.find('input').exists()).toBeTruthy()
    })
    it('has email input', () => {
      const input = wrapper.findAll('label')[0].text()
      expect(input).eq('Username')
    })
    it('has password input', () => {
      const input = wrapper.find('#password')
      expect(input.exists()).toBeTruthy()
    })
    it('has password type for password input', () => {
      const input = wrapper.find('#password')
      expect(input.attributes('type')).toBe('password')
    })

    it('has password repeat input', () => {
      const input = wrapper.find('#password-repeat')
      expect(input.exists()).toBeTruthy()
    })

    it('has password repeat type for password input', () => {
      const input = wrapper.find('#password-repeat')
      expect(input.attributes('type')).toBe('password')
    })

    it('has Sign Up Button', () => {
      expect(wrapper.find('button').text()).eq('Sign Up')
    })

    it('should disabled the button initially', () => {
      const button = wrapper.find('button')
      expect(button.element.disabled).toBe(true)
    })
  })
  describe('Interactions', () => {
    let button, passwordInput, passRepeatInput, usernameInput, wrapper
    const setup = async () => {
      wrapper = mount(SignUpPage, {
        attachTo: document.body
      })
      button = wrapper.find('button')
      usernameInput = wrapper.find('#username')
      const emailInput = wrapper.find('#e-mail')
      passwordInput = wrapper.find('#password')
      passRepeatInput = wrapper.find('#password-repeat')
      await usernameInput.setValue('user1')
      await emailInput.setValue('user1@mail.com')
      await passwordInput.setValue('P4ssword')
      await passRepeatInput.setValue('P4ssword')
    }
    it('should enable the button when password fields have same values', async () => {
      const wrapper = mount(SignUpPage)
      const button = wrapper.find('button')
      const passwordInput = wrapper.find('#password')
      const passRepeatInput = wrapper.find('#password-repeat')
      await passwordInput.setValue('P4ssword')
      await passRepeatInput.setValue('P4ssword')
      expect(button.element.disabled).toBe(false)
    })

    it('should send username, email and password to backend', async () => {
      await setup()

      await button.trigger('click')

      expect(requestBody).toStrictEqual({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword'
      })
    })

    it('should be an activation information after successful sign up request', async () => {
      await setup()

      await button.trigger('click')
      await flushPromises()

      const info = await wrapper.find('#info')
      expect(info.text()).toEqual('Please check your e-mail to activate your account')
    })

    it('should be hide sign up form after successful sign up request', async () => {
      await setup()
      await button.trigger('click')
      await flushPromises()
      const form = await wrapper.find('#form-sign-up')
      expect(form.isVisible()).toBe(false)
    })

    it('should be an validation error message for username', async () => {
      server.use(
        rest.post('/api/users', (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              message: {
                username: {
                  message: 'User validation failed'
                }
              }
            })
          )
        })
      )
      await setup()
      await button.trigger('click')
      await flushPromises()
      const usernameError = await wrapper.find('#error')
      expect(usernameError.text()).toEqual('User validation failed')
    })

    it('should be an validation error message for email', async () => {
      server.use(
        rest.post('/api/users', (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              message: {
                email: {
                  message: 'Email validation failed'
                }
              }
            })
          )
        })
      )
      await setup()
      await button.trigger('click')
      await flushPromises()
      const emailError = await wrapper.find('#error')
      expect(emailError.text()).toEqual('Email validation failed')
    })

    it('should be a mismatch message for password repeat error', async () => {
      await setup()
      await passwordInput.setValue('P4ss1')
      await passRepeatInput.setValue('P4ss2')
      const mismatchError = await wrapper.find('#error')
      expect(mismatchError.text()).toEqual('Nem ugyanaz a jelszo')
    });

    it('should be clear the validation error message for username', async () => {
      await setup()

      await wrapper.find('#username').setValue('')
      expect(wrapper.find('#error').exists()).toBeTruthy()

      await wrapper.find('#username').setValue('updated')
      expect(wrapper.find('#error').exists()).toBeFalsy()
    })
  })
})
