// tests go here; this will not be compiled when this package is used as an extension.

serial.writeLine("set up")
let dm11 = emakefun.createDM11();
serial.writeLine("setting frequency")

basic.forever(function () {
    dm11.set_pwm_duty(0, 0)
    dm11.set_pwm_duty(1, 4095)
    dm11.set_pwm_duty(2, 0)
    dm11.set_pwm_duty(3, 4095)

    basic.pause(1000)

    dm11.set_pwm_duty(0, 4095)
    dm11.set_pwm_duty(1, 0)
    dm11.set_pwm_duty(2, 4095)
    dm11.set_pwm_duty(3, 0)

    basic.pause(1000)
})