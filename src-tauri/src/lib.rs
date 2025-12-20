mod window_commands;

use tauri::{Emitter, Manager};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
use window_commands::open_settings;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_ai_response(message: String) -> String {
    format!("AI response: {}", message)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            #[cfg(desktop)]
            {
                let app_handle = app.handle().clone();

                // Register Ctrl+Shift+B
                // Register Ctrl+Shift+B
                match app.global_shortcut().register("ctrl+shift+b") {
                    Ok(_) => println!("✓ Registered Ctrl+Shift+B"),
                    Err(e) => println!("✗ Failed to register Ctrl+Shift+B: {}", e),
                }

                let app_clone = app_handle.clone();
                app.global_shortcut().on_shortcut("ctrl+shift+b", move |app, _shortcut, event| {
                    println!("Ctrl+Shift+B pressed! State: {:?}", event.state());
                    if event.state() == ShortcutState::Pressed {
                        let _ = app.emit("toggle_shortcut", "ctrl_shift_b");
                    }
                });

            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![open_settings])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
