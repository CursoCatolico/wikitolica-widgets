<?php
/**
 * Plugin Name:       Widget Calendario | Enciclopedia Wikitólica
 * Plugin URI:        https://www.wikitolica.com/w/widget-calendario/
 * Description:       Añade fácilmente el calendario litúrgico oficial de Wikitólica (santoral, fiestas y tiempos litúrgicos) como bloque Gutenberg, widget clásico o shortcode.
 * Version:           1.0.1
 * Author:            Wikitólica
 * Author URI:        https://www.wikitolica.com/
 * License:           CC BY-SA 4.0
 * License URI:       https://creativecommons.org/licenses/by-sa/4.0/deed.es
 * Text Domain:       wikitolica-calendario-widget
 * Requires at least: 5.8
 * Requires PHP:      7.4
 */

// Evitar acceso directo
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Encolar el script oficial solo en frontend (no en admin)
function wikitolica_calendario_enqueue_script() {
    if ( is_admin() ) {
        return;
    }
    
    wp_enqueue_script(
        'wikitolica-calendario',
        'https://cdn.jsdelivr.net/gh/CursoCatolico/wikitolica-widgets@main/calendario.js',
        array(),
        null,
        true // cargar en footer + defer
    );
}
add_action( 'wp_enqueue_scripts', 'wikitolica_calendario_enqueue_script' );

// ==================== SHORTCODE ====================
function wikitolica_calendario_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'days' => 14,
    ), $atts, 'wikitolica_calendario' );

    $days = absint( $atts['days'] );
    if ( $days < 1 || $days > 360 ) {
        $days = 14;
    }

    $output = sprintf(
        '<div id="wikitolica-calendario" data-days="%d">
            <a href="https://www.wikitolica.com/" target="_blank" rel="noopener noreferrer">Enciclopedia Católica Wikitólica</a>
         </div>',
        $days
    );

    return $output;
}
add_shortcode( 'wikitolica_calendario', 'wikitolica_calendario_shortcode' );

// ==================== WIDGET CLÁSICO ====================
class Wikitolica_Calendario_Widget extends WP_Widget {

    public function __construct() {
        parent::__construct(
            'wikitolica_calendario_widget',
            __( 'Calendario Wikitólica', 'wikitolica-calendario-widget' ),
            array(
                'description' => __( 'Muestra el santoral y calendario litúrgico de la Enciclopedia Wikitólica.', 'wikitolica-calendario-widget' ),
            )
        );
    }

    public function widget( $args, $instance ) {
        $days = ! empty( $instance['days'] ) ? absint( $instance['days'] ) : 14;
        if ( $days < 1 || $days > 360 ) {
            $days = 14;
        }

        echo $args['before_widget'];
        echo do_shortcode( '[wikitolica_calendario days="' . $days . '"]' );
        echo $args['after_widget'];
    }

    public function form( $instance ) {
        $days = ! empty( $instance['days'] ) ? absint( $instance['days'] ) : 14;
        ?>
        <p>
            <label for="<?php echo esc_attr( $this->get_field_id( 'days' ) ); ?>">
                <?php _e( 'Número de días a mostrar (1-360):', 'wikitolica-calendario-widget' ); ?>
            </label>
            <input class="widefat" 
                   id="<?php echo esc_attr( $this->get_field_id( 'days' ) ); ?>" 
                   name="<?php echo esc_attr( $this->get_field_name( 'days' ) ); ?>" 
                   type="number" 
                   min="1" 
                   max="360" 
                   value="<?php echo esc_attr( $days ); ?>">
        </p>
        <?php
    }

    public function update( $new_instance, $old_instance ) {
        $instance = array();
        $instance['days'] = absint( $new_instance['days'] );
        return $instance;
    }
}

// Registrar el widget
function wikitolica_calendario_register_widget() {
    register_widget( 'Wikitolica_Calendario_Widget' );
}
add_action( 'widgets_init', 'wikitolica_calendario_register_widget' );

// ==================== BLOQUE GUTENBERG (dinámico) ====================
function wikitolica_calendario_register_block() {
    register_block_type( 'wikitolica/calendario', array(
        'title'           => __( 'Calendario Wikitólica', 'wikitolica-calendario-widget' ),
        'icon'            => 'calendar-alt',
        'category'        => 'widgets',
        'description'     => __( 'Calendario litúrgico oficial de la Enciclopedia Wikitólica', 'wikitolica-calendario-widget' ),
        'attributes'      => array(
            'days' => array(
                'type'    => 'number',
                'default' => 14,
            ),
        ),
        'render_callback' => function( $attributes ) {
            $days = ! empty( $attributes['days'] ) ? absint( $attributes['days'] ) : 14;
            return do_shortcode( '[wikitolica_calendario days="' . $days . '"]' );
        },
        'supports' => array(
            'html' => false,
        ),
    ));
}
add_action( 'init', 'wikitolica_calendario_register_block' );
