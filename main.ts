//%block="Emakefun"
namespace emakefun {
    /**
     * Driver for the DM11 that two-way motor drive module.
     */
    /**
     * Create a new DM11 instance.
     * @param i2c_address I2C address of the DM11 module, default 0x15
     * @param frequency_hz Frequency of the motor, range: 1 ~ 10000,default 1000Hz
     * @return The new DM11 object
    */
    //% block="create dm11 with I2C address $i2c_address frequency $frequency_hz"
    //% subcategory="dm11"
    //% blockSetVariable=dm11
    //% i2c_address.defl=0x15
    //% frequency_hz.defl=1000
    //% weight=100
    //% inlineInputMode=external
    export function createDM11(i2c_address: number = 0x15, frequency_hz: number = 1000): Dm11 {
        return new Dm11(i2c_address, frequency_hz);
    }

    /**
     * DM11 class .
     */
    /**
   * Create a new DM11 instance.
   * @param i2c_address I2C address of the DM11 module, default 0x15
   * @param frequency_hz Frequency of the motor, range: 1 ~ 10000,default 1000Hz
   * @return The new DM11 object
   */
    export class Dm11 {

        private static readonly kVersionMajor = 1
        private static readonly kVersionMinor = 0
        private static readonly kVersionPatch = 2

        private static readonly kMemAddrPwmDuty0 = 0x50
        private static readonly kMemAddrPwmDuty1 = 0x52
        private static readonly kMemAddrPwmDuty2 = 0x54
        private static readonly kMemAddrPwmDuty3 = 0x56
        private static readonly kMemAddrFrequency = 0x60

        private static readonly kMinFrequencyHz = 1
        private static readonly kMaxFrequencyHz = 10000
        private static readonly kMaxPwmDuty = 4095
        private static readonly kPwmChannelNum = 4

        private readonly i2c_address: number = undefined

        /**
     * Constructor
     * @param i2c_address I2C address of the module, default 0x15
     * @param frequency_hz Frequency of the motor, range: 1 ~ 10000,default 1000Hz
     */
        constructor(i2c_address: number = 0x15, frequency_hz: number = 1000) {
            this.i2c_address = i2c_address;
            pins.i2cWriteBuffer(this.i2c_address, Buffer.pack('<BH', [Dm11.kMemAddrFrequency, frequency_hz]))
            let buffer = Buffer.create(Dm11.kPwmChannelNum * 2);
            buffer.fill(0);
            this.i2c_write([Dm11.kMemAddrPwmDuty0, buffer]);
        }

        i2c_write(args: any[]): void {
            let buffer = Buffer.create(0);

            for (let arg of args) {
                if (Array.isArray(arg)) {
                    buffer = buffer.concat(Buffer.fromArray(arg as number[]));
                } else if (typeof arg === 'number') {
                    buffer = buffer.concat(Buffer.fromArray([arg as number]));
                } else {
                    buffer = buffer.concat(arg as Buffer);
                }
            }
            pins.i2cWriteBuffer(this.i2c_address, buffer);
        }


        /**
         * set the pwm duty of the motor
         * @param channel channel of the motor, range: 0 ~ 3
         * @param duty duty of the motor, range: 0 ~ 4095
         */
        //% block="$this set pwm duty of channel $channel to $duty"
        //% subcategory="dm11"
        //% this.defl=dm11
        //% channel.min=0 channel.max=3
        //% duty.min=0 duty.max=4095
        //% weight=80
        //% blockGap=8
        set_pwm_duty(channel: number, duty: number) {
            pins.i2cWriteBuffer(this.i2c_address, Buffer.pack('<BH', [Dm11.kMemAddrPwmDuty0 + (((channel + 2) % Dm11.kPwmChannelNum) << 1), duty]));
        }
    }
}
