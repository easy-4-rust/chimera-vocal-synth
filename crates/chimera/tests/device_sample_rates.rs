//! 低设备采样率接收回归：验证真实输出，不把 NaN 静音或限幅饱和当成成功。
//! 修复来源：jamesondh/chimera-vocal-synth@186b75a1（上游 #33）。
use chimera::engine::Engine;
use chimera::voice::human_voice::HumanVoice;
use std::sync::OnceLock;

fn rendered_rms(fs: f64, mut render: impl FnMut(&mut [f32])) -> f64 {
    let mut out = vec![0.0f32; 2 * fs as usize];
    for chunk in out.chunks_mut(128) {
        render(chunk);
    }
    let invalid = out.iter().position(|x| !x.is_finite());
    assert_eq!(
        invalid, None,
        "{fs} Hz: non-finite PCM at sample {invalid:?}"
    );
    let tail = &out[fs as usize..];
    (tail.iter().map(|&x| f64::from(x).powi(2)).sum::<f64>() / tail.len() as f64).sqrt()
}

fn engine_rms(fs: f64) -> f64 {
    let mut e = Engine::new(fs);
    e.set_gate(1.0);
    rendered_rms(fs, |out| e.render(out))
}

fn reference_rms() -> f64 {
    static RMS: OnceLock<f64> = OnceLock::new();
    *RMS.get_or_init(|| engine_rms(48000.0))
}

fn assert_held_voice(fs: f64) {
    let reference = reference_rms();
    assert!(reference > 0.01, "48 kHz reference must produce sound");
    let rms = engine_rms(fs);
    println!("DEVICE_RATE fs={fs} rms={rms:.9} reference={reference:.9}");
    assert!(
        rms > 0.5 * reference && rms < 2.0 * reference,
        "{fs} Hz: RMS {rms:.9} must stay within 0.5x..2x of 48 kHz {reference:.9}"
    );
}

macro_rules! device_rate_test {
    ($name:ident, $rate:expr) => {
        #[test]
        fn $name() {
            assert_held_voice($rate);
        }
    };
}

device_rate_test!(held_voice_8000_hz, 8000.0);
device_rate_test!(held_voice_16000_hz, 16000.0);
device_rate_test!(held_voice_22050_hz, 22050.0);
device_rate_test!(held_voice_24000_hz, 24000.0);
device_rate_test!(held_voice_32000_hz, 32000.0);
device_rate_test!(held_voice_44100_hz, 44100.0);
device_rate_test!(held_voice_48000_hz, 48000.0);
device_rate_test!(held_voice_60000_hz, 60000.0);
device_rate_test!(held_voice_88200_hz, 88200.0);
device_rate_test!(held_voice_96000_hz, 96000.0);

#[test]
fn default_voice_is_stable_at_16000_hz() {
    let mut voice = HumanVoice::with_defaults(16000.0);
    voice.set_gate(1.0);
    let rms = rendered_rms(16000.0, |out| voice.render(out));
    let reference = reference_rms();
    assert!(
        rms > 0.5 * reference && rms < 2.0 * reference,
        "default voice RMS {rms}"
    );
}

#[test]
fn constructors_share_the_minimal_safe_factor_and_preserve_usual_rates() {
    for (fs, expected) in [
        (8000.0, 8),
        (16000.0, 4),
        (22050.0, 3),
        (24000.0, 3),
        (30000.0, 3),
        (30001.0, 2),
        (32000.0, 2),
        (44100.0, 2),
        (48000.0, 2),
        (60000.0, 2),
        (60001.0, 1),
        (88200.0, 1),
        (96000.0, 1),
    ] {
        let e = Engine::new(fs);
        let v = HumanVoice::with_defaults(fs);
        assert_eq!(e.voice().m, expected, "Engine at {fs}");
        assert_eq!(v.m, expected, "HumanVoice defaults at {fs}");
        assert!(fs * expected as f64 > 60000.0);
        assert!(expected == 1 || fs * (expected - 1) as f64 <= 60000.0);
    }
}
