<?php
/**
 * Template for displaying Retake button in single course.
 *
 * This template can be overridden by copying it to yourtheme/learnpress/single-course/buttons/retake.php.
 *
 * @author   ThimPress
 * @package  Learnpress/Templates
 * @version  4.0.0
 */

defined( 'ABSPATH' ) || exit();

$course = LP_Global::course();
$user   = LP_Global::user();
?>

<?php do_action( 'learn-press/before-retry-form' ); ?>

	<form name="retake-course" class="retake-course" method="post" enctype="multipart/form-data" data-confirm="<?php LP_Strings::esc_attr_e( 'confirm-retake-course', '', array( $course->get_title() ) ); ?>">

		<?php do_action( 'learn-press/before-retake-button' ); ?>

		<input type="hidden" name="retake-course" value="<?php echo esc_attr( $course->get_id() ); ?>"/>
		<input type="hidden" name="retake-course-nonce" value="<?php echo esc_attr( wp_create_nonce( sprintf( 'retake-course-%d-%d', $course->get_id(), $user->get_id() ) ) ); ?>"/>

		<button class="lp-button button button-retake-course">
			<?php echo esc_html__( 'Retry', 'learnpress' ); ?>
		</button>

		<input type="hidden" name="lp-ajax" value="retake-course"/>
		<input type="hidden" name="noajax" value="yes"/>

		<?php do_action( 'learn-press/after-retake-button' ); ?>

	</form>

<?php do_action( 'learn-press/after-retry-form' ); ?>
